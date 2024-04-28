import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ListItemContent,
  IconButton,
  Box,
  Chip,
  Divider,
  List,
  ListDivider,
} from "@mui/joy";
import {
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Category, Subcategory } from "../../../types/categories";
import SubcategoryItem from "./SubcategoryItem";
import CategoryEditModal from "./CategoryEditModal";
import DeleteModal from "../../../components/DeleteModal";

type CategoryItemProps = {
  category: Category;
  isOpen: boolean;
  onClick: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

function CategoryItem({
  category,
  isOpen,
  setIsOpen,
  onClick,
}: CategoryItemProps) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    listeners,
    attributes,
    transform,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  useEffect(() => {
    if (isDragging) {
      setIsOpen(false);
    }
  }, [isDragging, setIsOpen]);

  function handleOpenEditModal(open: boolean) {
    setOpenEditModal(open);
  }

  function handleOpenDeleteModal(open: boolean) {
    setOpenDeleteModal(open);
  }

  return (
    <>
      <CategoryEditModal
        title="Edit Category"
        open={openEditModal}
        setOpen={setOpenEditModal}
        onSubmit={() => {}}
        category={category}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => handleOpenDeleteModal(false)}
        onAccept={() => {}}
        onCancel={() => {}}
        dialogContent={`Are you sure you want to delete the category "${category.name.en}" and all it's subcategories? Ads associated with this category will no longer be available.`}
      />
      <ListItem
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        sx={{
          zIndex: isDragging ? 1 : "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ListItemButton selected={isOpen}>
          <ListItemDecorator
            {...listeners}
            {...attributes}
            onClick={(e) => e.preventDefault()}
            sx={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <DragIndicatorIcon />
          </ListItemDecorator>
          <ListItemContent onClick={onClick}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {category.name.en} <Chip>{category.subcategories.length}</Chip>
            </Box>
          </ListItemContent>
          <IconButton onClick={() => handleOpenEditModal(true)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenDeleteModal(true)}>
            <DeleteIcon />
          </IconButton>
          <IconButton>
            <AddIcon />
          </IconButton>
        </ListItemButton>
        {isOpen && !isDragging && (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              padding: "8px",
              width: "100%",
            }}
          >
            <Divider orientation="vertical" />
            <List sx={{ "--ListItem-paddingY": "8px", paddingLeft: "15px" }}>
              {category.subcategories.map((subcategory: Subcategory, i) => (
                <>
                  <SubcategoryItem
                    key={subcategory._id}
                    subcategory={subcategory}
                  />
                  {i < category.subcategories.length - 1 && <ListDivider />}
                </>
              ))}
            </List>
          </Box>
        )}
      </ListItem>
    </>
  );
}

export default CategoryItem;
