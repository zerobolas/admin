import {
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ListItemContent,
  IconButton,
  Box,
  Chip,
} from "@mui/joy";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Category, Subcategory } from "../../../types/categories";
import SubcategoryModal from "./SubcategoryModal";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import DeleteModal from "../../../components/DeleteModal";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  SubcategoriesResponse,
  deleteSubcategory,
} from "../../../api/organization";
import queryClient from "../../../utils/queryClient";
import { useNotification } from "../../../context/NotificationContext";

type SubcategoryItemProps = {
  category: Category;
  subcategory: Subcategory;
};

function SubcategoryItem({ category, subcategory }: SubcategoryItemProps) {
  const [openEditSubcategory, setOpenEditSubcategory] = useState(false);
  const [openDeleteSubcategory, setOpenDeleteSubcategory] = useState(false);
  const [isNew] = useState(
    () =>
      new Date(subcategory.createdAt).getTime() > Date.now() - 1000 * 60 * 60
  );
  const {
    listeners,
    attributes,
    transform,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({ id: subcategory._id });

  const { setNotification } = useNotification();

  const { mutate: deleteSubcategoryMutation } = useMutation({
    mutationFn: () => deleteSubcategory(category._id, subcategory._id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", category._id],
      });
      setOpenDeleteSubcategory(false);
      setNotification({
        message: "Subcategory deleted",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<SubcategoriesResponse>) => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", category._id],
      });
      setOpenDeleteSubcategory(false);
      setNotification({
        message: error.response?.data?.message || "An error occurred",
        type: "danger",
      });
    },
  });

  return (
    <>
      <SubcategoryModal
        open={openEditSubcategory}
        setOpen={setOpenEditSubcategory}
        subcategory={subcategory}
        category={category}
      />
      <DeleteModal
        open={openDeleteSubcategory}
        onClose={() => setOpenDeleteSubcategory(false)}
        onAccept={deleteSubcategoryMutation}
        onCancel={() => setOpenDeleteSubcategory(false)}
        dialogContent={`Are you sure you want to delete ${subcategory.name.en}?. Ads associated with this subcategory will be affected.`}
      />
      <ListItem
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
          transition,
        }}
        sx={{
          zIndex: isDragging ? 1 : "auto",
        }}
      >
        <ListItemButton>
          <ListItemDecorator
            {...listeners}
            {...attributes}
            sx={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <DragIndicatorIcon />
          </ListItemDecorator>
          <ListItemContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {subcategory.name.en}
              {isNew && <Chip color="primary">New</Chip>}
            </Box>
          </ListItemContent>
          <IconButton onClick={() => setOpenEditSubcategory(true)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setOpenDeleteSubcategory(true)}>
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      </ListItem>
    </>
  );
}

export default SubcategoryItem;
