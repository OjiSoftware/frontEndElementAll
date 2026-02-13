import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";

export interface Product {
    id: number;
    name: string;
    color: string;
    category: string;
    price: string;
}

export function ProductsTable({ products }: { products: Product[] }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table hoverable>
                <TableHead>
                    <TableRow>
                        <TableHeadCell>Product name</TableHeadCell>
                        <TableHeadCell>Color</TableHeadCell>
                        <TableHeadCell>Category</TableHeadCell>
                        <TableHeadCell>Price</TableHeadCell>
                        <TableHeadCell><span className="sr-only">Edit</span></TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {products.map((product) => (
                        <TableRow key={product.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {product.name}
                            </TableCell>
                            <TableCell>{product.color}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>
                                <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}