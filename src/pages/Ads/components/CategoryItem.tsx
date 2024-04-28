import { useEffect, useState } from "react";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { Category, Subcategory } from "../../../types/categories";
import SubcategoryItem from "./SubcategoryItem";
import CategoryEditModal from "./CategoryModal";
import DeleteModal from "../../../components/DeleteModal";
import {
  CategoriesResponse,
  deleteCategory,
  updateSubcategory,
  getSubcategories,
} from "../../../api/organization";
import queryClient from "../../../utils/queryClient";
import { useNotification } from "../../../context/NotificationContext";
import { AxiosError } from "axios";
import SubcategoryModal from "./SubcategoryModal";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

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
  const [openCreateSubcategory, setOpenCreateSubcategory] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(
    category.subcategories
  );
  const [specialCategory] = useState(() =>
    ["all"].includes(category.categoryId)
  );
  const { setNotification } = useNotification();
  const {
    listeners,
    attributes,
    transform,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const { data: subcategoriesData } = useQuery({
    queryKey: ["subcategories", category._id],
    queryFn: () => getSubcategories(category._id),
  });

  useEffect(() => {
    if (subcategoriesData?.data?.data?.subcategories) {
      setSubcategories(
        subcategoriesData?.data?.data?.subcategories.sort(
          (a, b) => a.index - b.index
        )
      );
    }
  }, [subcategoriesData]);

  const { mutate: deleteCategoryMutation } = useMutation({
    mutationFn: () => deleteCategory(category._id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setNotification({
        message: "Category deleted",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<CategoriesResponse>) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setNotification({
        message: error.response?.data?.message || "An error occurred",
        type: "danger",
      });
    },
  });

  const { mutate: updateSubcategoryMutation } = useMutation({
    mutationFn: (subcategory: Partial<Subcategory>) =>
      updateSubcategory(category._id, subcategory),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", category._id],
      });
      setNotification({
        message: "Subcategory updated",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<CategoriesResponse>) => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", category._id],
      });
      setNotification({
        message: error.response?.data?.message || "An error occurred",
        type: "danger",
      });
    },
  });

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSubcategories((subcategories) => {
        if (!subcategories) return [];
        const activeIndex = subcategories.findIndex(
          (subcategory) => subcategory._id === active.id
        );
        const overIndex = subcategories.findIndex(
          (subcategory) => subcategory._id === over?.id
        );
        if (activeIndex === -1 || overIndex === -1) return subcategories;
        updateSubcategoryMutation({
          _id: active.id.toString(),
          index: overIndex,
        });
        return arrayMove(subcategories, activeIndex, overIndex);
      });
    }
  }

  return (
    <>
      <CategoryEditModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        category={category}
      />
      <SubcategoryModal
        open={openCreateSubcategory}
        setOpen={setOpenCreateSubcategory}
        category={category}
        setSubcategories={setSubcategories}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => handleOpenDeleteModal(false)}
        onAccept={deleteCategoryMutation}
        onCancel={() => {}}
        dialogContent={`Are you sure you want to delete the category "${category.name.en}" and all it's subcategories? Ads associated with this category will no longer be available.`}
      />
      <ListItem
        id={category._id}
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
              {category.name.en}
              {!specialCategory && <Chip>{category.subcategories.length}</Chip>}
              {new Date(category.createdAt).getTime() >
                new Date().getTime() - 1000 * 60 * 5 && (
                <Chip color="primary">New</Chip>
              )}
            </Box>
          </ListItemContent>
          <IconButton onClick={() => handleOpenEditModal(true)}>
            <EditIcon />
          </IconButton>
          {!specialCategory && (
            <>
              <IconButton onClick={() => handleOpenDeleteModal(true)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => setOpenCreateSubcategory(true)}>
                <AddIcon />
              </IconButton>
            </>
          )}
        </ListItemButton>
        {!specialCategory && isOpen && !isDragging && (
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
            <DndContext
              onDragEnd={handleDragEnd}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={subcategories.map(
                  (subcategory: Subcategory) => subcategory._id
                )}
                strategy={verticalListSortingStrategy}
              >
                <List
                  sx={{ "--ListItem-paddingY": "8px", paddingLeft: "15px" }}
                >
                  {subcategories.map((subcategory: Subcategory, i) => (
                    <div key={subcategory._id}>
                      <SubcategoryItem
                        category={category}
                        subcategory={subcategory}
                      />
                      {i < subcategories.length - 1 && <ListDivider />}
                    </div>
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </Box>
        )}
      </ListItem>
    </>
  );
}

export default CategoryItem;
