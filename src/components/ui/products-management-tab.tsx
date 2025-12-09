// File: components/ui/products-management-tab.tsx
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

// Mock products data for fallback
const mockProducts = [
  {
    id: 1,
    name: "Analytics Platform",
    description: "Advanced data analytics and visualization platform",
    leadsInterested: 23
  },
  {
    id: 2,
    name: "API Gateway",
    description: "Secure and scalable API management solution",
    leadsInterested: 18
  },
  {
    id: 3,
    name: "Security Suite",
    description: "Comprehensive cybersecurity solution",
    leadsInterested: 31
  },
  {
    id: 4,
    name: "Dashboard Tools",
    description: "Customizable dashboard creation tools",
    leadsInterested: 15
  }
];

export function ProductsManagementTab({ 
  products,
  getProductInterestCount, 
  filterLeadsByProduct,
  onProductInterestClick,
  handleDeleteProduct, 
  openBulkEdit, 
  setIsAddProductDialogOpen 
}) {
  // Safe fallbacks for props
  const safeProducts = products || mockProducts;
  const safeGetProductInterestCount = getProductInterestCount || ((productName) => {
    const product = safeProducts.find(p => p.name === productName);
    return product?.leadsInterested || 0;
  });
  const safeFilterLeadsByProduct = filterLeadsByProduct || onProductInterestClick || (() => {});
  const safeHandleDeleteProduct = handleDeleteProduct || (() => console.log('Delete product'));
  const safeOpenBulkEdit = openBulkEdit || (() => console.log('Open bulk edit'));
  const safeSetIsAddProductDialogOpen = setIsAddProductDialogOpen || (() => console.log('Add product'));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products of Interest</CardTitle>
            <CardDescription>Manage the products your team can select when capturing leads</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={safeOpenBulkEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
            <Button onClick={() => safeSetIsAddProductDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {safeProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products available</p>
              <p className="text-sm">Add products to start tracking lead interests</p>
            </div>
          ) : (
            safeProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-sm text-muted-foreground hover:underline"
                      onClick={() => safeFilterLeadsByProduct(product.name)}
                    >
                      {safeGetProductInterestCount(product.name)} leads interested
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => safeHandleDeleteProduct(product)}
                  className="text-destructive hover:text-destructive"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
