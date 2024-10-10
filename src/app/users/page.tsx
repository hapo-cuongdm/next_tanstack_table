"use client";

import React, { CSSProperties, useEffect, useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnPinningPosition,
  ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg";
import { CustomNextImage } from "@/components/form/CustomNextImage";
import { CustomFormModal } from "@/components/modal/CustomFormModal";
import { AddUserForm } from "@/components/user/AddUserForm";
import { useSortingStateFromUrl } from "@/hooks/useSortingStateFromUrl";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  avatar: string;
  status: string;
  job: string;
  pet: string;
  identical: string;
};

type Thead = {
  header: Header<Person, unknown>;
  getIsPinned?: ColumnPinningPosition;
  isSortingColumn?: boolean | number;
  onClickSortCell?: (value: Header<Person, unknown>) => void;
};

const getCommonPinningStyles = (column: Column<Person>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
      ? "4px 0 4px -4px gray inset"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.5 : 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    backgroundColor: isPinned ? "green" : "inherit",
    color: isPinned ? "white" : "black",
  };
};

export default function UserList() {
  const { sortingList, sorting, onSortingChange } = useSortingStateFromUrl();

  const [userList, setUserList] = useState<Array<Person>>([]);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [loadingDataTable, setLoadingDataTable] = useState<boolean>(false);
  const [sortDescStatus, setSortDescStatus] = useState<boolean | number>(-1);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });

  const onClickSortCell = (header: Header<Person, unknown>) => {
    // header.column.getToggleSortingHandler(); // default sort by tanstack
    if (header.column.getCanSort()) {
      // manual sort by server
      if (!sortDescStatus) {
        header.column.clearSorting();
        setSortDescStatus(-1);
      } else {
        let status = sortDescStatus == -1 ? true : !sortDescStatus;
        header.column.toggleSorting(status);
        setSortDescStatus(status);
      }
    }
  };

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorFn: (row) => (
          <div className="flex items-center gap-2">
            <CustomNextImage
              src={row.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
              width={30}
              height={30}
            />
            <div className="font-medium dark:text-white">
              <div>{`${row.firstName} ${row.lastName}`}</div>
              <div className="text-sm dark:text-gray-500">
                Joined in August 2014
              </div>
            </div>
          </div>
        ),
        id: "fullName",
        header: "Full Name",
        cell: (info) => info.getValue(),
        size: 270,
        enableResizing: true,
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        header: () => <span>First Name</span>,
        enableResizing: false,
      },
      {
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        enableResizing: false,
        accessorFn: (row) => row.lastName,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        enableResizing: false,
        enableSorting: false,
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "status",
        accessorFn: (row) => (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
            {row.status}
          </span>
        ),
        cell: (info) => info.getValue(),
        header: () => "Status",
        enableResizing: false,
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "job",
        header: "Job",
        enableResizing: false,
      },
      {
        accessorKey: "pet",
        header: "Pet",
        enableResizing: false,
      },
      {
        accessorKey: "identical",
        header: "Identical",
        enableResizing: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: userList,
    columns: columns,
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnPinningChange: setColumnPinning,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    columnResizeMode: "onChange",
    manualSorting: true,
    onSortingChange,
    state: {
      columnPinning,
      sorting,
    },
  });

  useEffect(() => {
    setLoadingDataTable(true);
    const fetchUserList = async () => {
      let sortString = "";
      if (sortingList.length) {
        for (const sort of sortingList) {
          let sortBy = sort.id;
          const order = sort.desc ? "desc" : "asc";
          if (sort.id == "fullName") {
            sortBy = "firstName";
          }
          sortString = `?sortBy=${sortBy}&order=${order}`;
        }
      }

      const url = `https://66ff94734da5bd2375511acd.mockapi.io/api/v1/users${sortString}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setUserList(json);
      setLoadingDataTable(false);
    };
    fetchUserList();
  }, [sortingList]);

  return (
    <div>
      <div className="flex justify-between items-center m-3">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          User List
        </h1>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => {
            setOpenCreateModal(true);
          }}
        >
          Create
        </button>
      </div>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative overflow-x-auto">
        {loadingDataTable ? (
          <TableLoading rows={10} />
        ) : (
          <table
            className="w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400"
            style={{
              width: table.getTotalSize(),
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const { column } = header;
                    const getIsPinned = header.column.getIsPinned();
                    const sortColumnId = sortingList.length
                      ? sortingList[0].id
                      : "";
                    const isSortingColumn =
                      header.column.id == sortColumnId ? sortDescStatus : -1;

                    return (
                      <th
                        className="px-6 py-3"
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ ...getCommonPinningStyles(column) }}
                      >
                        <TheadSortName
                          header={header}
                          isSortingColumn={isSortingColumn}
                          onClickSortCell={onClickSortCell}
                        />
                        <TheadPinned
                          header={header}
                          getIsPinned={getIsPinned}
                        />
                        <TheadResize header={header} />
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => {
                    const { column } = cell;
                    return (
                      <td
                        className="px-6 py-4 text-center"
                        key={cell.id}
                        style={{ ...getCommonPinningStyles(column) }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <TablePaginate table={table} />
      <CustomFormModal open={openCreateModal}>
        <AddUserForm setOpen={setOpenCreateModal} />
      </CustomFormModal>
    </div>
  );
}

const TheadSortName = (props: Thead) => {
  const { header, onClickSortCell, isSortingColumn } = props;
  const { column } = header;

  return (
    <div
      {...{
        className: `${
          header.column.getCanSort() ? "cursor-pointer select-none" : ""
        } whitespace-nowrap flex justify-center mb-1`,
        onClick: () => {
          if (onClickSortCell) onClickSortCell(header);
        },
      }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}{" "}
      {column.getIndex(column.getIsPinned() || "center")}
      <TheadSortIcon header={header} isSortingColumn={isSortingColumn} />
    </div>
  );
};

const TheadSortIcon = (props: Thead) => {
  const { header, isSortingColumn } = props;

  switch (isSortingColumn) {
    case true: {
      return <SortDescIcon />;
    }
    case false: {
      return <SortAscIcon />;
    }
    default:
      return null;
  }
  // return (
  //   <>
  //     {{
  //       asc: ( <SortAscIcon /> ),
  //       desc: ( <SortDescIcon /> ),
  //     }[header.column.getIsSorted() as string] ?? null}
  //   </>
  // );
};

const TheadPinned = (props: Thead) => {
  const { header, getIsPinned } = props;
  return (
    <>
      {!header.isPlaceholder && header.column.getCanPin() && (
        <div className="flex gap-1 justify-center">
          {getIsPinned !== "left" ? (
            <button
              className="border rounded px-2"
              onClick={() => {
                header.column.pin("left");
              }}
            >
              {"<="}
            </button>
          ) : null}
          {getIsPinned ? (
            <button
              className="border rounded px-2"
              onClick={() => {
                header.column.pin(false);
              }}
            >
              X
            </button>
          ) : null}
          {getIsPinned !== "right" ? (
            <button
              className="border rounded px-2"
              onClick={() => {
                header.column.pin("right");
              }}
            >
              {"=>"}
            </button>
          ) : null}
        </div>
      )}
    </>
  );
};

const TheadResize = (props: Thead) => {
  const { header } = props;
  return (
    <div
      {...{
        onDoubleClick: () => header.column.resetSize(),
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `resizer ${
          header.column.getIsResizing() ? "isResizing" : ""
        }`,
      }}
    />
  );
};

const TableLoading = (props: { rows: number }) => {
  const { rows } = props;
  const numberOfRows = new Array(rows).fill(0);
  return (
    <div
      role="status"
      className="max-w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 w-96 overflow-x-auto md:w-full"
    >
      {numberOfRows.map((_, index: number) => {
        return (
          <div
            className={`flex items-center justify-between gap-3 ${
              index != 0 && "pt-4"
            }`}
            key={index}
          >
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
            {index == rows - 1 && <span className="sr-only">Loading...</span>}
          </div>
        );
      })}
    </div>
  );
};

const TablePaginate = (props: { table: Table<Person> }) => {
  const { table } = props;
  const getPageNumberList = () => {
    return Array.from(Array(table.getPageCount()).keys());
  };
  const isMobile = window.innerWidth < 768;
  if (!table.getRowModel().rows.length) return null;
  return (
    <nav
      className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 gap-3"
      aria-label="Table navigation"
    >
      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
        <li>
          <button
            className={`${
              !table.getCanPreviousPage() && "paginate__button--disabled"
            } paginate__button ms-0 rounded-s-lg`}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </button>
        </li>
        <li>
          <button
            className={`${
              !table.getCanPreviousPage() && "paginate__button--disabled"
            } paginate__button`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
        </li>
        {!isMobile
          ? getPageNumberList().map((page: number) => {
              return (
                <li key={page}>
                  <button
                    className={`${
                      table.getState().pagination.pageIndex === page &&
                      "paginate__button--selected"
                    } paginate__button`}
                    onClick={() => {
                      table.setPageIndex(page);
                    }}
                  >
                    {page + 1}
                  </button>
                </li>
              );
            })
          : null}

        <li>
          <button
            className={`${
              !table.getCanNextPage() && "paginate__button--disabled"
            }
              paginate__button`}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </li>
        <li>
          <button
            className={`${
              !table.getCanNextPage() && "paginate__button--disabled"
            } paginate__button rounded-e-lg`}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </button>
        </li>
      </ul>
      <div className="flex items-center flex-wrap md:flex-row flex-row gap-3">
        {!isMobile ? (
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 block md:inline md:w-auto">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>{" "}
            | Go to page:{" "}
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </span>
        ) : null}
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

const SortAscIcon = () => {
  return (
    <CustomNextImage src={ArrowUpIcon} width={15} height={15} alt="arrow up" />
  );
};

const SortDescIcon = () => {
  return (
    <CustomNextImage
      src={ArrowDownIcon}
      width={15}
      height={15}
      alt="arrow down"
    />
  );
};
