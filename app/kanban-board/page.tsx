"use client";
import React, { useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

type TaskType = {
  id: number;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  title: string;
  descrption: string;
};

type DropTarget = {
  column: TaskType["status"];
  taskId: number | null;
  position: "above" | "below";
};

const titleMap = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

function Task({
  task,
  isDropTargetAbove,
  isDropTargetBelow,
}: {
  task: TaskType;
  isDropTargetAbove: boolean;
  isDropTargetBelow: boolean;
}) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: `task-${task.id}`,
    data: { task },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <>
      {isDropTargetAbove && (
        <div className="h-2 bg-blue-500 rounded w-full mb-1" />
      )}
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="cursor-grab p-4 bg-zinc-200 rounded-xl"
      >
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm">{task.descrption}</p>
      </div>
      {isDropTargetBelow && (
        <div className="h-2 bg-blue-500 rounded w-full mt-1" />
      )}
    </>
  );
}

function Column({
  status,
  tasks,
  dropTarget,
}: {
  status: TaskType["status"];
  tasks: TaskType[];
  dropTarget: DropTarget | null;
}) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      className="bg-zinc-800 flex-1 p-2 rounded-xl min-h-[300px]"
      ref={setNodeRef}
    >
      <div className="bg-gray-300 px-4 py-2 flex justify-between rounded-xl">
        <span>{titleMap[status]}</span>
        <span>{tasks.length}</span>
      </div>
      <div className="mt-4 space-y-2">
        {tasks.map((task) => {
          const isAbove =
            dropTarget?.column === status &&
            dropTarget?.taskId === task.id &&
            dropTarget?.position === "above";
          const isBelow =
            dropTarget?.column === status &&
            dropTarget?.taskId === task.id &&
            dropTarget?.position === "below";
          return (
            <Task
              key={task.id}
              task={task}
              isDropTargetAbove={isAbove}
              isDropTargetBelow={isBelow}
            />
          );
        })}
        {/* Drop at bottom of column */}
        {dropTarget?.column === status && dropTarget?.taskId === null && (
          <div className="h-2 bg-blue-500 rounded w-full mt-1" />
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: 1, status: "TODO", title: "Design login", descrption: "UI + UX" },
    { id: 2, status: "TODO", title: "API Setup", descrption: "Express + TS" },
    { id: 3, status: "IN_PROGRESS", title: "Schema", descrption: "DB schema" },
    { id: 4, status: "DONE", title: "Init repo", descrption: "npm init" },
    { id: 5, status: "TODO", title: "JWT login", descrption: "User auth" },
  ]);

  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = parseInt(event.active.id.toString().replace("task-", ""));
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, delta } = event;
    if (!over) return;

    const overId = over.id.toString();

    if (["TODO", "IN_PROGRESS", "DONE"].includes(overId)) {
      setDropTarget({
        column: overId as TaskType["status"],
        taskId: null,
        position: "below",
      });
      return;
    }

    if (overId.startsWith("task-")) {
      const targetId = parseInt(overId.replace("task-", ""));
      const hoveredTask = tasks.find((t) => t.id === targetId);
      if (!hoveredTask) return;

      const position = delta.y > 0 ? "below" : "above";
      setDropTarget({ column: hoveredTask.status, taskId: targetId, position });
    }
  };

  const handleDragEnd = () => {
    if (!dropTarget || draggedTaskId === null) return;

    const dragged = tasks.find((t) => t.id === draggedTaskId);
    if (!dragged) return;

    const filteredTasks = tasks.filter((t) => t.id !== draggedTaskId);
    const targetColumnTasks = filteredTasks.filter(
      (t) => t.status === dropTarget.column
    );

    let index = targetColumnTasks.length;

    if (dropTarget.taskId !== null) {
      const i = targetColumnTasks.findIndex((t) => t.id === dropTarget.taskId);
      index = dropTarget.position === "above" ? i : i + 1;
    }

    const newTask: TaskType = { ...dragged, status: dropTarget.column };
    targetColumnTasks.splice(index, 0, newTask);

    const newTasks = [
      ...filteredTasks.filter((t) => t.status !== dropTarget.column),
      ...targetColumnTasks,
    ];

    setTasks(newTasks);
    setDropTarget(null);
    setDraggedTaskId(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-6xl mx-auto flex gap-4">
          {(["TODO", "IN_PROGRESS", "DONE"] as TaskType["status"][]).map(
            (status) => (
              <Column
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                dropTarget={dropTarget}
              />
            )
          )}
        </div>
      </DndContext>
    </div>
  );
}
