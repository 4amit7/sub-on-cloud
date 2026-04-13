export type MenuItem = {
  id?: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type MenuResponse = {
  categories: MenuCategory[];
};

export type MenuItemPayload = MenuItem & {
  categoryName: string;
};
