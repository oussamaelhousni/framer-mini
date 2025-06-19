"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { v4 } from "uuid";
import { MdDelete } from "react-icons/md";

// dnd-ki
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { createPortal } from "react-dom";

type TaskType = {
  id: string;
  column: string;
  text: string;
};

type ColumnType = {
  id: string;
  title: string;
};

type TaskPropsType = {
  task: TaskType;
  deleteTask: (taskId: TaskType["id"]) => void;
  updateTask: (newTask: TaskType) => void;
};

type ColumnPropstype = {
  column: ColumnType;
  tasks: TaskType[];
  deleteColumn: (id: ColumnType["id"]) => void;
  updateColumn: (c: ColumnType) => void;
  deleteTask: (taskId: TaskType["id"]) => void;
  updateTask: (newTask: TaskType) => void;
  createNewTask: (columnId: ColumnType["id"]) => void;
};

function Task({ task, deleteTask, updateTask }: TaskPropsType) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "TASK",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={`px-2 py-4 bg-neutral-700 rounded text-white flex items-center justify-between cursor-grab ${
        isDragging && "border-2 border-red-500"
      }`}
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      {!isEditing && (
        <p className="flex-1" onClick={() => setIsEditing(true)}>
          {task.text}
        </p>
      )}
      {isEditing && (
        <input
          value={task.text}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
          onChange={(e) => updateTask({ ...task, text: e.target.value })}
        />
      )}
      <button
        className="p-1 shrink-0 bg-red-400 rounded-lg hover:bg-red-500 cursor-pointer ml-auto"
        onClick={() => deleteTask(task.id)}
      >
        <MdDelete size={15} />
      </button>
    </div>
  );
}

function Column({
  column,
  tasks,
  updateColumn,
  deleteColumn,
  deleteTask,
  updateTask,
  createNewTask,
}: ColumnPropstype) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // make column sortable
  const {
    setNodeRef,
    attributes,
    transform,
    transition,
    listeners,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "COLUMN",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const tasksIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  if (isDragging)
    return (
      <div
        className={`bg-neutral-900 rounded-lg p-1 w-[300px] min-h-[400px] flex flex-col border-2 border-red-500`}
        ref={setNodeRef}
        style={style}
      ></div>
    );

  return (
    <div
      className={`bg-neutral-900 rounded-lg p-1 w-[300px] min-h-[400px] flex flex-col`}
      style={style}
      ref={setNodeRef}
    >
      <div
        className="bg-neutral-700 p-2 rounded text-neutral-100 flex items-center gap-2"
        onClick={() => setIsEditing(true)}
        {...attributes}
        {...listeners}
      >
        <span className="size-6 flex items-center justify-center bg-neutral-600 rounded-full text-neutral-100 text-sm shrink-0">
          {tasks.length ?? 0}
        </span>
        <div className="flex-1">
          {!isEditing && (
            <span className="text-neutral-100 flex-1">{column.title}</span>
          )}

          {isEditing && (
            <input
              ref={inputRef}
              className={`text-neutral-100 border-2 border-red-500  outline-none rounded flex-1 flex pl-1`}
              value={column.title}
              onClick={() => {
                setIsEditing(true);
                inputRef.current?.focus();
              }}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                }
              }}
              onChange={(e) => {
                updateColumn({
                  ...column,

                  title: e.target.value,
                });
              }}
            />
          )}
        </div>

        <button
          className="p-1 shrink-0 bg-red-500 rounded-lg hover:bg-red-400 cursor-pointer ml-auto"
          onClick={() => deleteColumn(column.id)}
        >
          <MdDelete size={20} />
        </button>
      </div>

      <div className="flex-1 pt-2 flex flex-col gap-1.5">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <Task
              task={task}
              deleteTask={deleteTask}
              key={task.id}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <div>
        <button
          className="px-4 w-full text-nowrap py-2 rounded bg-neutral-600 hover:bg-neutral-700 text-white flex items-center gap-2 hover:border-red-800 cursor-pointer"
          onClick={() => createNewTask(column.id)}
        >
          <IoAddCircle size={20} />
          Add new task
        </button>
      </div>
    </div>
  );
}
function KanbanBoardComplex() {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: "1", title: "Doing" },
    { id: "2", title: "In progress" },
    { id: "3", title: "Done" },
  ]);
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: "task-1", column: "1", text: "This is a task 1" },
    { id: "task-2", column: "1", text: "This is a task 2" },
    { id: "task-3", column: "1", text: "This is a task 3" },
    { id: "task-4", column: "2", text: "This is a task 4" },
  ]);

  // columns function
  const addNewColumn = () => {
    setColumns((prev) => [
      ...prev,
      {
        id: v4(),
        title: "New title",
      },
    ]);
  };

  const deleteColumn = (id: ColumnType["id"]) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
  };

  const updateColumn = (c: ColumnType) => {
    setColumns((prev) =>
      prev.map((column) => (column.id === c.id ? { ...c } : column))
    );
  };

  // tasks functions
  const deleteTask = (taskId: TaskType["id"]) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTask = (newTask: TaskType) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === newTask.id) {
          return newTask;
        }
        return task;
      })
    );
  };

  const createNewTask = (columnId: ColumnType["id"]) => {
    setTasks((prev) => [
      ...prev,
      { id: v4(), column: columnId, text: "New Task" },
    ]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const columnsIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "COLUMN") {
      console.log(active.data.current.column);
      setActiveColumn(active.data.current.column);
    }

    if (active.data.current?.type === "TASK") {
      setActiveTask(active.data.current?.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    if (
      active.data.current?.type === "COLUMN" &&
      over.data.current?.type === "COLUMN"
    ) {
      const currentColumnId = active.id;
      const swappedWithColumnId = over.id;

      if (currentColumnId !== swappedWithColumnId) {
        const currentColumnIndex = columns.findIndex(
          (c) => c.id === currentColumnId
        );
        const swappedWithColumnIndex = columns.findIndex(
          (c) => c.id === swappedWithColumnId
        );

        setColumns((prev) => {
          return arrayMove(prev, currentColumnIndex, swappedWithColumnIndex);
        });
      }
    }

    setActiveColumn(null);
    setActiveTask(null);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (active.data.current?.type === "TASK") {
      // check if i'm over a task
      if (over?.data.current?.type === "TASK") {
        const swappedWithTask = over.data.current.task;
        const swappedWithTaskIndex = tasks.findIndex((t) => t.id === over.id);
        const currentTaskIndex = tasks.findIndex((t) => t.id === active.id);
        if (over.id === active.id) return;
        return setTasks((prev) => {
          return arrayMove(
            prev.map((t) => {
              if (t.id === active.id) {
                t.column = swappedWithTask.column;
              }
              return t;
            }),
            currentTaskIndex,
            swappedWithTaskIndex
          );
        });
      }

      if (over?.data.current?.type === "COLUMN") {
        setTasks((prev) => {
          return prev.map((t) => {
            if (t.id === active.id) {
              t.column = over.id as ColumnType["id"];
            }
            return t;
          });
        });
      }
    }
  };

  const [isBrowser, settIsBrowser] = useState(false);
  useEffect(() => settIsBrowser(true), []);

  return (
    <div className="min-h-screen w-full flex items-center px-[40px] overflow-auto bg-neutral-800">
      <div className="mx-auto flex gap-4 items-start">
        <DndContext
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          sensors={sensors}
        >
          <SortableContext items={columnsIds}>
            {columns.map((c) => {
              return (
                <Column
                  column={c}
                  tasks={tasks.filter((task) => task.column === c.id)}
                  key={c.id}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  createNewTask={createNewTask}
                />
              );
            })}
          </SortableContext>
          {isBrowser &&
            createPortal(
              <DragOverlay>
                {activeColumn && (
                  <Column
                    column={activeColumn}
                    deleteColumn={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    updateColumn={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    deleteTask={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    updateTask={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    createNewTask={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    tasks={tasks.filter((t) => t.column === activeColumn.id)}
                  />
                )}

                {activeTask && (
                  <Task
                    task={activeTask}
                    deleteTask={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    updateTask={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
        <button
          className="bg-neutral-700 px-4 text-nowrap py-2 rounded border-2 border-neutral-500 text-white flex items-center gap-2 hover:border-red-800 cursor-pointer"
          onClick={addNewColumn}
        >
          <IoAddCircle size={20} />
          Add new column
        </button>
      </div>
    </div>
  );
}

export default KanbanBoardComplex;
