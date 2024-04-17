import React from "react";
import { Table, Skeleton } from "@mui/joy";

const TableSkeleton: React.FC = () => {
  return (
    <Table
      borderAxis="xBetween"
      size="md"
      stickyFooter={false}
      stickyHeader={false}
      variant="plain"
    >
      <thead>
        <tr>
          {Array.from({ length: 4 }).map((_, index) => (
            <th key={index}>
              <Skeleton variant="text" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 4 }).map((_, index) => (
          <tr key={index}>
            {Array.from({ length: 4 }).map((_, index) => (
              <td key={index}>
                <Skeleton
                  variant="text"
                  width={`${Math.floor(Math.random() * 100) + 20}%`}
                  sx={{ maxWidth: "100%" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableSkeleton;
