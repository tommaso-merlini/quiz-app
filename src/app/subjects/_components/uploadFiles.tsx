"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploader } from "./fileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { dumpFiles } from "../_actions/dumpFiles";
import { dumpText } from "../_actions/dumpText";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function UploadFiles({ subjectID }: { subjectID: number }) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [name, setName] = React.useState<string>("");
  const [text, setText] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const simulateProgress = () => {
    setProgress(0);
    return setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          return 90;
        }
        return prevProgress + Math.random() * 10;
      });
    }, 500);
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      throw new Error("No files selected");
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("subjectID", subjectID.toString());
    setIsLoading(true);
    const progressInterval = simulateProgress();
    try {
      await dumpFiles(formData);
      clearInterval(progressInterval);
      setProgress(100);
      setFiles([]);
      toast("Files uploaded successfully!", {
        description: "You just uploaded some files, now go take a quiz!",
      });
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setOpen(false);
      setProgress(0);
    }
  };

  const handleUploadText = async () => {
    if (name.trim() === "" || text.trim() === "") {
      throw new Error("Name and text are required");
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("text", text);
    formData.append("subjectID", subjectID.toString());
    setIsLoading(true);
    const progressInterval = simulateProgress();
    try {
      await dumpText(formData);
      clearInterval(progressInterval);
      setProgress(100);
      setName("");
      setText("");
      toast("Text uploaded successfully!", {
        description: "You just uploaded a text, now go take a quiz!",
      });
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setOpen(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          Dump Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Dump Material</DialogTitle>
          <DialogDescription>
            Dump all the Material you got: text, images, pdfs
          </DialogDescription>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You cannot upload Images (this is not an error just for you). We
              are currently researching for the best way to handle images, for
              now just use text and pdfs. Thank you for your patience
            </AlertDescription>
          </Alert>
        </DialogHeader>
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files">Images and PDFs</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
          <TabsContent value="files">
            <FileUploader
              maxFiles={8}
              maxSize={100 * 1024 * 1024} //TODO: this is a max of 100 MB, what can i do
              onValueChange={setFiles}
            />
            <DialogFooter className="pt-2 flex flex-row space-x-4">
              {isLoading && (
                <div className="w-full mt-4">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
              <Button onClick={handleUploadFiles} disabled={isLoading}>
                {!isLoading ? "Upload Files" : "Uploading..."}
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="text">
            <Input
              name="name"
              placeholder="title of the text"
              required
              className="mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="Paste your text here"
              name="text"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input type="hidden" name="subjectID" value={subjectID} />
            <DialogFooter className="pt-2 flex flex-row space-x-4">
              {isLoading && (
                <div className="w-full mt-4">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
              <Button disabled={isLoading} onClick={handleUploadText}>
                {!isLoading ? "Upload Text" : "Uploading..."}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
