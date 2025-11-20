import React from "react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "../../../components";
import useCreateGroup from "../hooks/useCreateGroup";
import groupPhoto from "../../../assets/networks/group.png";
import { Pencil } from "lucide-react";

const GroupForm: React.FC = () => {
  const {
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
  } = useCreateGroup();
  let inputId = "group-image-input";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white  border-gray-200 rounded-2xl p-6 space-y-5"
    >
      {/* Image Upload */}
      <div className="flex flex-col items-center gap-3 border-none pb-4">
        <div className="flex flex-col items-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            name="image"
            className="hidden w-full max-w-xs text-sm"
            id={inputId}
          />
          <label htmlFor={inputId} className="cursor-pointer select-none">
            <div
              aria-label=""
              role="button"
              className="outline-1 bg-white outline-gray-800 hover:outline-[1.5px] text-gray-800 mx-auto p-1 w-[22px]  rounded-full translate-y-34 translate-x-12 transition-all duration-100 ease-out"
            >
              <Pencil size={14} />
            </div>
            {/* Centered preview */}
            <div className="mt-4">
              <div className="w-28 h-28 rounded-lg overflow-hidden border border-gray-100 shadow-sm mx-auto">
                <img
                  src={image ? URL.createObjectURL(image) : groupPhoto}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Group Name */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Group Name</Label>
        <Input
          name="name"
          placeholder="Enter group name"
          value={groupData.name}
          onChange={handleChange}
          required
          className="w-full border"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Description</Label>
        <Textarea
          name="description"
          placeholder="Describe your group"
          value={groupData.description}
          onChange={handleChange}
          rows={4}
          className="w-full"
        />
      </div>

      {/* Category */}
      <div className="border rounded-md p-3">
        <Label htmlFor="category" className="text-sm font-medium">
          Category
        </Label>

        <Select
          value={groupData.category}
          onValueChange={(value) =>
            handleChange({ target: { name: "category", value } } as any)
          }
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Group Type */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Group Type</Label>
        <div className="flex items-center gap-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="public"
              checked={groupData.isPrivate === false}
              onChange={handleChange}
              className="accent-blue-600"
            />
            <span className="text-sm">Public</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="private"
              checked={groupData.isPrivate === true}
              onChange={handleChange}
              className="accent-blue-600"
            />
            <span className="text-sm">Private</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div className="border rounded-lg p-3">
        <Label className="text-sm font-medium">Tags</Label>

        {/* Tag badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {groupData.tags?.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  setGroupData((prev) => ({
                    ...prev,
                    tags: prev.tags?.filter((_, i) => i !== index),
                  }))
                }
                className="text-blue-700 hover:text-blue-900"
                aria-label={`Remove tag ${tag}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Tag input */}
        <Input
          name="tagInput"
          placeholder="Type a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tagInput.trim() !== "") {
              e.preventDefault();
              if (!groupData.tags?.includes(tagInput.trim())) {
                setGroupData((prev) => ({
                  ...prev,
                  tags: [...(prev.tags || []), tagInput.trim()],
                }));
              }
              setTagInput("");
            }
          }}
          className="mt-3 w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Creating..." : "Create Group"}
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;
