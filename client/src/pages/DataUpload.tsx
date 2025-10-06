import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const COMPANIES = [
  "Blinkit (Zomato)",
  "Zepto",
  "Swiggy Instamart",
  "BBNow (BigBasket)",
  "Dunzo Daily",
  "Other"
];

export default function DataUpload() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (validTypes.includes(fileExtension)) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file (.csv, .xlsx, .xls)",
          variant: "destructive",
        });
      }
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
          title: "Upload successful!",
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

  return (
    <div className="container mx-auto p-6 max-w-4xl" data-testid="page-upload">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Company Data</h1>
        <p className="text-muted-foreground">
          Import courier and delivery data from Excel or CSV files
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Company</CardTitle>
            <CardDescription>
              Choose the delivery company for the data you're uploading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="company-select">Company Name</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger id="company-select" data-testid="select-company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload CSV or Excel files containing courier and delivery data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80">
                      Click to upload
                    </span>
                    {" "}or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    CSV, XLSX, or XLS files
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    data-testid="input-file"
                  />
                </div>
                {selectedFile && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span data-testid="text-filename">{selectedFile.name}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedCompany || uploading}
                className="w-full"
                data-testid="button-upload"
              >
                {uploading ? "Uploading..." : "Upload Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {uploadResult && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                Upload Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2" data-testid="upload-results">
                <p className="text-sm">
                  <strong>Couriers Created:</strong> {uploadResult.stats.couriersCreated}
                </p>
                <p className="text-sm">
                  <strong>Deliveries Created:</strong> {uploadResult.stats.deliveriesCreated}
                </p>
                {uploadResult.stats.errors > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <AlertCircle className="h-4 w-4" />
                      <strong>{uploadResult.stats.errors} errors occurred</strong>
                    </div>
                    {uploadResult.stats.errorDetails.length > 0 && (
                      <ul className="mt-2 ml-6 text-sm text-yellow-700 dark:text-yellow-300 list-disc">
                        {uploadResult.stats.errorDetails.map((error: string, idx: number) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>File Format Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">For Courier Data:</h4>
                <p className="text-muted-foreground">Include columns: name/courierName, status, lat/latitude, lng/longitude, activeDeliveries, performanceScore, location, vehicle, phone</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Delivery Data:</h4>
                <p className="text-muted-foreground">Include columns: orderId, customerId, customerName, address, lat/latitude, lng/longitude, courierId, status, eta, priority, packageSize</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> The system will automatically detect whether rows contain courier or delivery data based on the columns present.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
