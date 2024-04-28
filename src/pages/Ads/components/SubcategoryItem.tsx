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

type SubcategoryItemProps = {
  category: Category;
  subcategory: Subcategory;
};

function SubcategoryItem({ category, subcategory }: SubcategoryItemProps) {
  const [openEditSubcategory, setOpenEditSubcategory] = useState(false);
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

  return (
    <>
      <SubcategoryModal
        open={openEditSubcategory}
        setOpen={setOpenEditSubcategory}
        subcategory={subcategory}
        category={category}
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
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      </ListItem>
    </>
  );
}

export default SubcategoryItem;
