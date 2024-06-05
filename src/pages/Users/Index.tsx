import { useEffect, useState } from "react";
import {
  Table,
  Sheet,
  IconButton,
  Box,
  FormControl,
  FormLabel,
  Select,
  Option,
  Typography,
  Dropdown,
  Menu,
  MenuItem,
  MenuButton,
  Divider,
  CircularProgress,
} from "@mui/joy";
import PageWrapper from "../../components/PageWrapper";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "../../types/users";
import { getUsers, exportUsers, deleteUser, updateUser } from "../../api/users";
import {
  NotificationContextType,
  useNotification,
} from "../../context/NotificationContext";
import TableSkeleton from "../../components/TableSkeleton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import queryClient from "../../utils/queryClient";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { AxiosError } from "axios";
import { APIResponse } from "../../types/api";
import AlertDialogModal from "../../components/DeleteModal";

function RowMenu({
  user,
  page,
  rowsPerPage,
}: {
  user: User;
  page: number;
  rowsPerPage: number;
}) {
  const { setNotification } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", page, rowsPerPage],
      });
      setNotification({
        message: "User deleted",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<APIResponse>) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      setNotification({
        message: errorMessage,
        type: "danger",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", page, rowsPerPage],
      });
      setNotification({
        message: "User updated",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<APIResponse>) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      setNotification({
        message: errorMessage,
        type: "danger",
      });
    },
  });

  return (
    <>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "soft", color: "neutral", size: "sm" },
          }}
        >
          <MoreHorizIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }} variant="soft">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Publish ad</MenuItem>
          <MenuItem
            onClick={() => {
              updateUserMutation.mutate({
                id: user.id,
                data: {
                  role: user.role === "admin" ? "user" : "admin",
                },
              });
            }}
          >
            {user.role === "admin" ? "Remove admin" : "Make admin"}
          </MenuItem>
          <Divider />
          <MenuItem
            color="danger"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Dropdown>
      <AlertDialogModal
        dialogContent={`Are you sure you want to delete ${user.name}?`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAccept={() => {
          deleteUserMutation.mutate(user.id);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}

function Index() {
  const {
    setNotification,
  }: { setNotification: NotificationContextType["setNotification"] } =
    useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [exportIsLoading, setExportIsLoading] = useState(false);
  const {
    data: { data: usersQuery } = {},
    isError,
    error,
  } = useQuery({
    queryKey: ["users", page, rowsPerPage],
    queryFn: () => getUsers({ page, rowsPerPage }),
  });

  const users = usersQuery?.data?.users as User[];
  const totalUsers = usersQuery?.totalAvailable || 0;

  useEffect(() => {
    if (isError) {
      setNotification({
        message: error?.message || "An error occurred",
        type: "danger",
      });
    }
  }, [isError, error, setNotification]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeRowsPerPage = (_: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue?.toString() || "50", 10));
    setPage(0);
  };

  function labelDisplayedRows({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  }

  const getLabelDisplayedRowsTo = () => {
    if (users.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? users.length
      : Math.min(totalUsers, (page + 1) * rowsPerPage);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const exportCSV = async () => {
    try {
      setExportIsLoading(true);
      const response = await exportUsers();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();
      setExportIsLoading(false);
      setNotification({
        message: "CSV exported",
        type: "success",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setNotification({
        message: error?.message || "An error occurred",
        type: "danger",
      });
      setExportIsLoading(false);
    }
  };

  return (
    <>
      <PageWrapper
        title="Users"
        button={{
          label: exportIsLoading ? <CircularProgress /> : "Export CSV",
          color: "primary",
          onClick: exportCSV,
          disabled: exportIsLoading,
        }}
      >
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
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "auto",
              "--TableCell-height": "40px",
              // the number is the amount of the header rows.
              "--TableHeader-height": "calc(1 * var(--TableCell-height))",
              "--Table-firstColumnWidth": "80px",
              "--Table-lastColumnWidth": "144px",
              // background needs to have transparency to show the scrolling shadows
              "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
              "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
            }}
          >
            {!users && <TableSkeleton rows={rowsPerPage} cols={4} />}
            {users && (
              <Table
                borderAxis="xBetween"
                size="md"
                stickyFooter={false}
                stickyHeader={false}
                variant="plain"
                sx={{
                  borderRadius: "md",
                  "& tr > *:last-child": {
                    position: "sticky",
                    right: 0,
                    bgcolor: "var(--TableCell-headBackground)",
                  },
                  minWidth: "800px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "30%" }}>Name</th>
                    <th style={{ width: "40%" }}>Email</th>
                    <th style={{ width: "20%" }}>Created At</th>
                    <th style={{ textAlign: "center", width: "75px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Typography>{user.name}</Typography>
                          {user.role === "admin" && (
                            <ManageAccountsIcon
                              sx={{
                                width: 20,
                              }}
                              color="primary"
                            />
                          )}
                        </Box>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {(user.createdAt &&
                          new Date(user.createdAt).toLocaleDateString()) ||
                          "unknown"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <RowMenu
                          user={user}
                          rowsPerPage={rowsPerPage}
                          page={page}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          justifyContent: "flex-end",
                        }}
                      >
                        <FormControl orientation="horizontal" size="sm">
                          <FormLabel>Rows per page:</FormLabel>
                          <Select
                            onChange={handleChangeRowsPerPage}
                            value={rowsPerPage}
                            variant="soft"
                          >
                            <Option value={5}>5</Option>
                            <Option value={10}>10</Option>
                            <Option value={25}>25</Option>
                            <Option value={50}>50</Option>
                          </Select>
                        </FormControl>
                        <Typography textAlign="center" sx={{ minWidth: 80 }}>
                          {labelDisplayedRows({
                            from:
                              users.length === 0 ? 0 : page * rowsPerPage + 1,
                            to: getLabelDisplayedRowsTo(),
                            count: totalUsers === -1 ? -1 : totalUsers,
                          })}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="sm"
                            color="neutral"
                            variant="outlined"
                            disabled={page === 0}
                            onClick={() => handleChangePage(page - 1)}
                            sx={{ bgcolor: "background.surface" }}
                          >
                            <KeyboardArrowLeft />
                          </IconButton>
                          <IconButton
                            size="sm"
                            color="neutral"
                            variant="outlined"
                            disabled={
                              totalUsers !== -1
                                ? page >=
                                  Math.ceil(totalUsers / rowsPerPage) - 1
                                : false
                            }
                            onClick={() => handleChangePage(page + 1)}
                            sx={{ bgcolor: "background.surface" }}
                          >
                            <KeyboardArrowRight />
                          </IconButton>
                        </Box>
                      </Box>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            )}
          </Sheet>
        </Box>
      </PageWrapper>
    </>
  );
}

export default Index;
