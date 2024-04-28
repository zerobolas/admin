import {
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ListItemContent,
  IconButton,
} from "@mui/joy";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Subcategory } from "../../../types/categories";

function SubcategoryItem({ subcategory }: { subcategory: Subcategory }) {
  return (
    <ListItem>
      <ListItemButton>
        <ListItemDecorator
        // {...listeners}
        // {...attributes}
        // sx={{
        //   cursor: isDragging ? "grabbing" : "grab",
        // }}
        >
          <DragIndicatorIcon />
        </ListItemDecorator>
        <ListItemContent>{subcategory.name.en}</ListItemContent>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
}

export default SubcategoryItem;
