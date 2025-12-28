
    export type RemoteKeys = 'products/ProductList';
    type PackageType<T> = T extends 'products/ProductList' ? typeof import('products/ProductList') :any;