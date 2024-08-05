import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Sheet,
} from "@mui/joy";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AxiosError } from "axios";
import { Category } from "../../types/categories";
import {
  CategoriesResponse,
  getCategories,
  updateCategory,
} from "../../api/organization";
import { useNotification } from "../../context/NotificationContext";
import queryClient from "../../utils/queryClient";
import PageWrapper from "../../components/PageWrapper";
import TableSkeleton from "../../components/TableSkeleton";
import AddIcon from "@mui/icons-material/Add";

import CategoryItem from "./components/CategoryItem";
import CategoryCreateModal from "./components/CategoryModal";
import { DragIndicator } from "@mui/icons-material";

const specialCategories = ["properties", "vehicles", "jobs", "services", "all"];

function Categories() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [somethingToSellOpen, setSomethingToSellOpen] = useState(true);
  const { setNotification } = useNotification();
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { mutate: updateCategoryMutation } = useMutation({
    mutationFn: (category: Partial<Category>) => updateCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setNotification({
        message: "Category updated",
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

  useEffect(() => {
    if (categoriesData?.data?.data?.categories) {
      setCategories(
        categoriesData.data.data.categories.sort((a, b) => a.index - b.index)
      );
    }
  }, [categoriesData]);

  function handleCategoryOpen(categoryId: string) {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  }

  function handleCategoryClose(isOpen: boolean) {
    if (!isOpen) {
      setOpenCategory(null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCategories((categories) => {
        if (!categories) return [];
        const activeIndex = categories.findIndex(
          (category) => category._id === active.id
        );
        const overIndex = categories.findIndex(
          (category) => category._id === over?.id
        );
        if (activeIndex === -1 || overIndex === -1) return categories;
        updateCategoryMutation({
          _id: active.id.toString(),
          index: overIndex,
        });
        return arrayMove(categories, activeIndex, overIndex);
      });
    }
  }

  return (
    <>
      <PageWrapper
        title="Categories"
        button={{
          label: "New category",
          color: "primary",
          onClick: () => setOpenCreateCategory(true),
          icon: <AddIcon />,
        }}
      >
        <CategoryCreateModal
          open={openCreateCategory}
          setOpen={setOpenCreateCategory}
        />
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Sheet
            sx={{
              width: "100%",
              boxShadow: "sm",
              borderRadius: "sm",
            }}
          >
            {!categories && <TableSkeleton rows={40} cols={1} />}
            {categories && (
              <List>
                {categories
                  .filter((c) => specialCategories.includes(c.categoryId))
                  .map((category: Category) => (
                    <div key={category._id}>
                      <CategoryItem
                        category={category}
                        isOpen={openCategory === category._id}
                        setIsOpen={handleCategoryClose}
                        onClick={() => handleCategoryOpen(category._id)}
                      />
                      <ListDivider />
                    </div>
                  ))}
                <DndContext
                  onDragEnd={handleDragEnd}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={categories.map((category: Category) => category._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ListItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <ListItemButton
                        onClick={() =>
                          setSomethingToSellOpen(!somethingToSellOpen)
                        }
                      >
                        <ListItemDecorator>
                          <DragIndicator />
                        </ListItemDecorator>
                        <ListItemContent>Something to Sell</ListItemContent>
                        <IconButton onClick={() => setOpenCreateCategory(true)}>
                          <AddIcon />
                        </IconButton>
                      </ListItemButton>
                      <Box
                        sx={{
                          display: somethingToSellOpen ? "flex" : "none",
                          gap: "8px",
                          alignItems: "center",
                          padding: "8px",
                          width: "100%",
                        }}
                      >
                        <Divider
                          orientation="vertical"
                          sx={{
                            "--Divider-thickness": "5px",
                          }}
                        />
                        <List>
                          {categories
                            .filter(
                              (c) => !specialCategories.includes(c.categoryId)
                            )
                            .map((category: Category, i) => (
                              <div key={category._id}>
                                <CategoryItem
                                  category={category}
                                  isOpen={openCategory === category._id}
                                  setIsOpen={handleCategoryClose}
                                  onClick={() =>
                                    handleCategoryOpen(category._id)
                                  }
                                />
                                {i < categories.length - 1 && <ListDivider />}
                              </div>
                            ))}
                        </List>
                      </Box>
                    </ListItem>
                    <ListDivider />
                  </SortableContext>
                </DndContext>
              </List>
            )}
          </Sheet>
        </Box>
      </PageWrapper>
    </>
  );
}

export default Categories;
