import { useState, type ChangeEvent, type FormEvent } from "react";
import { createGroups } from "../../../lib/axios/groupInstance";
import type { ApiGroupType } from "../../../lib/types/groupType";
import { useNavigate, type NavigateFunction } from "react-router-dom";

export default function useCreateGroup() {
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const navigate: NavigateFunction = useNavigate();

  const categories = [
    "technology",
    "design",
    "business",
    "marketing",
    "startup",
    "leadership",
    "networking",
    "development",
  ];

  const [groupData, setGroupData] = useState<ApiGroupType>({
    id: "",
    name: "",
    description: "",
    category: "",
    isPrivate: false,
    tags: []
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as any;

    if (name === "type") {
      setGroupData((prev) => ({ ...prev, isPrivate: value === "private" }));
    } else {
      setGroupData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!groupData.name || !groupData.category) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", groupData.name);
    formData.append("description", groupData.description);
    formData.append("category", groupData.category);
    formData.append("isPrivate", JSON.stringify(groupData.isPrivate));
    formData.append("tags", JSON.stringify(groupData.tags));
    formData.append("admin", JSON.stringify(groupData.admin));
    if (image) formData.append("image", image);

    console.log("image is ", formData.get("image"));

    await createGroup(formData);
    console.log("this is group", groupData);
  };

  const createGroup = async (formData: FormData) => {
    try {
      setLoading(true);
      console.log(formData);
      await createGroups(formData);
      navigate("/networks/groups/"); // redirect after success
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleChange,
    handleSubmit,
    handleImageChange,
    image,
    groupData,
    categories,
    setGroupData,
    setTagInput,
    tagInput,
  };
}
