interface IPlan {
    id?: number;
    name: string;
    price: number;
    description?: string;
    discount?: number;
    discountReason?: string; // <-- nuevo
    versionNumber?: number;
    active?: boolean;
  }
  
  