"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "../../lib/supabaseClient";

interface Counselor {
  id?: string;
  name: string;
  category: string;
  specialization: string;
  photo_url?: string;
  phone: string;
  email: string;
  languages: string[];
  available_timeframe: string;
}

const emptyForm: Counselor = {
  name: "",
  category: "Legal",
  specialization: "",
  photo_url: "",
  phone: "",
  email: "",
  languages: [],
  available_timeframe: "",
};

export default function AdminCounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Counselor>(emptyForm);
  const [languagesInput, setLanguagesInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    const { data, error } = await supabase
      .from("counselors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching counselors:", error);
    } else {
      setCounselors(data as Counselor[]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return null;

    setUploadingPhoto(true);
    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("counselor-photos")
      .upload(filePath, photoFile);

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      alert("Failed to upload photo");
      setUploadingPhoto(false);
      return null;
    }

    const { data } = supabase.storage
      .from("counselor-photos")
      .getPublicUrl(filePath);

    setUploadingPhoto(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let photoUrl = formData.photo_url;
    if (photoFile) {
      const uploadedUrl = await uploadPhoto();
      if (uploadedUrl) {
        photoUrl = uploadedUrl;
      }
    }

    const counselorData = {
      ...formData,
      photo_url: photoUrl,
      languages: languagesInput.split(",").map((lang) => lang.trim()),
    };

    if (isEditing && formData.id) {
      const { error } = await supabase
        .from("counselors")
        .update(counselorData)
        .eq("id", formData.id);

      if (error) {
        console.error("Error updating counselor:", error);
        alert("Failed to update counselor");
      } else {
        alert("Counselor updated successfully!");
      }
    } else {
      const { error } = await supabase.from("counselors").insert(counselorData);

      if (error) {
        console.error("Error adding counselor:", error);
        alert("Failed to add counselor");
      } else {
        alert("Counselor added successfully!");
      }
    }

    setIsLoading(false);
    setIsModalOpen(false);
    setFormData(emptyForm);
    setLanguagesInput("");
    setPhotoFile(null);
    setPhotoPreview("");
    fetchCounselors();
  };

  const handleEdit = (counselor: Counselor) => {
    setFormData(counselor);
    setLanguagesInput(counselor.languages.join(", "));
    setPhotoPreview(counselor.photo_url || "");
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this counselor?")) return;

    const { error } = await supabase.from("counselors").delete().eq("id", id);

    if (error) {
      console.error("Error deleting counselor:", error);
      alert("Failed to delete counselor");
    } else {
      alert("Counselor deleted successfully!");
      fetchCounselors();
    }
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setLanguagesInput("");
    setPhotoFile(null);
    setPhotoPreview("");
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Counselor Management</h1>
            <p className="text-muted-foreground">Add and manage counselors</p>
          </div>
          <Button onClick={openAddModal} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Counselor
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {counselors.map((counselor) => (
            <Card key={counselor.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    {counselor.photo_url ? (
                      <AvatarImage
                        src={counselor.photo_url}
                        alt={counselor.name}
                      />
                    ) : (
                      <AvatarFallback>
                        {getInitials(counselor.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{counselor.name}</CardTitle>
                    <Badge className="mt-1">{counselor.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Specialization:</strong> {counselor.specialization}
                  </p>
                  <p>
                    <strong>Email:</strong> {counselor.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {counselor.phone}
                  </p>
                  <p>
                    <strong>Languages:</strong> {counselor.languages.join(", ")}
                  </p>
                  <p>
                    <strong>Available:</strong> {counselor.available_timeframe}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(counselor)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(counselor.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Counselor" : "Add New Counselor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} />
                  ) : (
                    <AvatarFallback>
                      <ImageIcon className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a professional photo (JPG, PNG)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Legal">Legal</option>
                  <option value="Psychiatric">Psychiatric</option>
                  <option value="Financial">Financial</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specialization *</Label>
              <Input
                required
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                placeholder="e.g., Family Law, Trauma Therapy, Debt Management"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="counselor@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages Spoken (comma-separated) *</Label>
              <Input
                required
                placeholder="English, Spanish, French"
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Available Timeframe *</Label>
              <Input
                required
                placeholder="e.g., Mon-Fri 9AM-5PM, Weekends 10AM-2PM"
                value={formData.available_timeframe}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available_timeframe: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading || uploadingPhoto}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || uploadingPhoto}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading || uploadingPhoto
                  ? "Saving..."
                  : isEditing
                  ? "Update Counselor"
                  : "Add Counselor"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
