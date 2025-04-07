// app/api/tasks/[taskId]/route.ts
import { NextRequest, NextResponse } from "next/server";

// 获取任务状态
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;

    // 检查任务ID是否有效
    if (!taskId || typeof taskId !== "string") {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // 从我们的模拟数据库中获取任务
    // 在实际场景中，这会从真实数据库中获取
    if (!global.tasks || !global.tasks.has(taskId)) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = global.tasks.get(taskId);

    // 创建响应对象，移除内部数据
    const response = { ...task };
    delete response._internal;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Task status API error:", error);
    return NextResponse.json(
      { error: "Failed to get task status" },
      { status: 500 }
    );
  }
}
