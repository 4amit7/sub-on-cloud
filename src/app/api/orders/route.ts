import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

type Order = {
  items: any[];
  totalAmount: number;
  customerName: string;
  phone: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "pending" | "paid";
  createdAt: Date;
};

const COLLECTION_NAME = "orders";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    if (id) {
      // Get single order by ID
      const order: any = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    } else {
      // Get all orders
      const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();

      return NextResponse.json(orders, {
        headers: { "Cache-Control": "no-store" }
      });
    }
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Unable to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Omit<Order, 'status' | 'paymentStatus' | 'createdAt'>;

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);
    
    const result = await collection.insertOne({
      ...body,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date()
    });

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId,
        _id: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status, paymentStatus } = await req.json() as {
      orderId: string;
      status?: "pending" | "approved" | "rejected";
      paymentStatus?: "pending" | "paid";
    };

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    if (!status && !paymentStatus) {
      return NextResponse.json(
        { error: "status or paymentStatus is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("orders");
    const id = orderId;
    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          ...(status && { status }),
          ...(paymentStatus && { paymentStatus }),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

    // Send WhatsApp confirmation if payment is marked as paid
    if (paymentStatus === "paid") {
      try {
        // Get order details
        const order: any = await collection.findOne({ _id: new ObjectId(id) });
        if (order) {
          // Get settings for WhatsApp number
          const settingsCollection = db.collection("settings");
          const settings: any = await settingsCollection.findOne({});

          const whatsappNumber = settings?.whatsapp || "919999999999";
          
          // Create confirmation message
          const itemsList = order.items.map((item: any) => 
            `${item.name} (x${item.qty || 1}) - ₹${item.price * (item.qty || 1)}`
          ).join("%0A");
          
          const confirmationMessage = `✅ Payment Confirmed!%0A%0AOrder ID: ${order._id}%0A%0AItems:%0A${itemsList}%0A%0ATotal: ₹${order.totalAmount}%0A%0ACustomer: ${order.customerName}%0APhone: ${order.phone}%0AAddress: ${order.address}%0A%0AThank you for your payment! We'll start preparing your order right away.`;

          // Note: In a real implementation, you would send this via WhatsApp API
          // For now, we'll log it (the message would be sent when customer clicks "I have completed payment")
          console.log("Payment confirmed WhatsApp message:", confirmationMessage);
          console.log("WhatsApp URL:", `https://wa.me/${whatsappNumber}?text=${confirmationMessage}`);
        }
      } catch (whatsappError) {
        console.error("Failed to send WhatsApp confirmation:", whatsappError);
        // Don't fail the request if WhatsApp fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json(
      { error: "Unable to update order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as { id: string; status: "pending" | "paid" | "completed" };
    const { id, status } = body;

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { paymentStatus: status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json(
      { error: "Unable to update order" },
      { status: 500 }
    );
  }
}
