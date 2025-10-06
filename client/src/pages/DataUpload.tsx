import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, ShoppingBag, Zap, Truck, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

const COMPANIES = [
  { 
    id: "Blinkit (Zomato)", 
    name: "Blinkit", 
    subtitle: "by Zomato",
    color: "#F6CB46",
    darkColor: "#E0C460",
    icon: Zap,
    description: "10-minute grocery delivery"
  },
  { 
    id: "Zepto", 
    name: "Zepto", 
    subtitle: "Quick Commerce",
    color: "#E91E63",
    darkColor: "#F06292",
    icon: Clock,
    description: "Ultra-fast delivery"
  },
  { 
    id: "Swiggy Instamart", 
    name: "Instamart", 
    subtitle: "by Swiggy",
    color: "#FC8019",
    darkColor: "#FF9933",
    icon: ShoppingBag,
    description: "Instant grocery delivery"
  },
  { 
    id: "BBNow (BigBasket)", 
    name: "BBNow", 
    subtitle: "by BigBasket",
    color: "#84C225",
    darkColor: "#9CCC65",
    icon: Package,
    description: "Quick essentials"
  },
  { 
    id: "Dunzo Daily", 
    name: "Dunzo Daily", 
    subtitle: "Daily Essentials",
    color: "#0066FF",
    darkColor: "#4285F4",
    icon: Truck,
    description: "Daily needs delivery"
  }
];

export default function DataUpload() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (validTypes.includes(fileExtension)) {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCompany) {
      toast({
        title: "Missing information",
        description: "Please select both a company and a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('company', selectedCompany);

      const response = await fetch('/api/upload-data', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        toast({
          title: "Upload successful",
          description: `Imported ${result.stats.couriersCreated} couriers and ${result.stats.deliveriesCreated} deliveries`,
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/couriers'] });
        queryClient.invalidateQueries({ queryKey: ['/api/deliveries'] });
        
        setSelectedFile(null);
        setSelectedCompany("");
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const selectedCompanyData = COMPANIES.find(c => c.id === selectedCompany);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" data-testid="page-upload">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Data Import</h1>
        <p className="text-base text-muted-foreground">
          Import courier and delivery data from Excel or CSV files
        </p>
      </div>

      <div className="space-y-8">
        {/* Company Selection */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Select Company
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COMPANIES.map((company) => {
              const Icon = company.icon;
              const isSelected = selectedCompany === company.id;
              
              return (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  data-testid={`select-company-${company.id}`}
                  className={cn(
                    "relative group text-left transition-all duration-200",
                    "rounded-xl border-2 p-5",
                    isSelected 
                      ? "border-foreground shadow-md" 
                      : "border-border hover:border-foreground/30 hover:shadow-sm"
                  )}
                >
                  <div className="flex flex-col gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ 
                        backgroundColor: company.color,
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-foreground">
                        {company.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {company.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 
                        className="w-5 h-5" 
                        style={{ color: company.color }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Upload File
          </h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-12 transition-all duration-200",
                  dragActive 
                    ? "border-primary" 
                    : "border-border hover:border-foreground/30"
                )}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  data-testid="input-file"
                />
                
                {!selectedFile ? (
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Drop your file here, or <span className="text-primary">browse</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Supports CSV, XLSX, and XLS files up to 10MB
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium" data-testid="text-filename">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !selectedCompany || uploading}
                  className="w-full h-12 text-base font-medium shadow-sm hover:shadow"
                  size="lg"
                  data-testid="button-upload"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Import Data
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1" data-testid="upload-results">
                  <h3 className="font-semibold text-lg text-green-900 dark:text-green-100 mb-3">
                    Import Successful
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Couriers Imported</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {uploadResult.stats.couriersCreated}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deliveries Imported</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {uploadResult.stats.deliveriesCreated}
                      </p>
                    </div>
                  </div>
                  {uploadResult.stats.errors > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">{uploadResult.stats.errors} rows had errors</span>
                      </div>
                      {uploadResult.stats.errorDetails.length > 0 && (
                        <ul className="ml-6 text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                          {uploadResult.stats.errorDetails.map((error: string, idx: number) => (
                            <li key={idx} className="list-disc">{error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Format Guide */}
        <Card className="border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">File Format Requirements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">Courier Data Columns</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• name / courierName</p>
                  <p>• status</p>
                  <p>• lat / latitude, lng / longitude</p>
                  <p>• activeDeliveries</p>
                  <p>• performanceScore</p>
                  <p>• location, vehicle, phone</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">Delivery Data Columns</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• orderId, customerId, customerName</p>
                  <p>• address</p>
                  <p>• lat / latitude, lng / longitude</p>
                  <p>• courierId, status, eta</p>
                  <p>• priority, packageSize</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                The system automatically detects data types based on columns. Both courier and delivery data can be in the same file.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
