// app/api/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    // 使用 FormData 获取文件和其他数据
    const formData = await request.formData();

    // 获取模板数据
    const templateJson = formData.get("template") as string;
    let template;

    try {
      template = JSON.parse(templateJson);
    } catch (error) {
      console.error("Failed to parse template JSON:", error);
      return NextResponse.json(
        { error: "Invalid template data" },
        { status: 400 }
      );
    }

    // 获取图像文件
    const imageFiles: File[] = [];
    const imageIds: string[] = [];

    // 收集所有图像文件和ID
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image_") && value instanceof File) {
        imageFiles.push(value);
        // 提取image_<id>格式中的id部分
        const imageId = key.substring(6); // 去除'image_'前缀
        imageIds.push(imageId);
      }
    }

    // 打印接收到的元数据（用于调试）
    console.log("Template:", {
      id: template.id,
      name: template.name,
      fields: template.fields.map((f: any) => f.name),
    });

    console.log(
      "Images:",
      imageFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      }))
    );

    // 生成唯一任务ID并存储相关信息（在真实场景中，这会存储在数据库中）
    const taskId = `msgbatch_${randomUUID().replace(/-/g, "")}`;

    // 这里只是返回任务ID和状态，而不是立即返回结果
    // 在实际场景中，我们会将任务添加到队列中异步处理
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 1); // 24小时后过期

    const taskStatus = {
      id: taskId,
      type: "message_batch",
      processing_status: "in_progress",
      request_counts: {
        processing: imageIds.length,
        succeeded: 0,
        errored: 0,
        canceled: 0,
        expired: 0,
      },
      ended_at: null,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      cancel_initiated_at: null,
      results_url: null,
      // 在实际场景中，我们会将以下数据存储在数据库中
      _internal: {
        imageIds,
        templateId: template.id,
        template,
      },
    };

    // 模拟存储任务（在实际场景中，这会存储在数据库中）
    // 这里我们使用一个全局变量模拟数据库
    if (!global.tasks) {
      global.tasks = new Map();
    }
    global.tasks.set(taskId, taskStatus);

    // 模拟异步处理 - 在后台处理任务
    setTimeout(() => {
      processTaskInBackground(taskId, imageIds, template, imageFiles);
    }, 100);

    return NextResponse.json(taskStatus);
  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      { error: "Failed to process extraction request" },
      { status: 500 }
    );
  }
}

// 模拟后台处理任务
async function processTaskInBackground(
  taskId: string,
  imageIds: string[],
  template: any,
  imageFiles: File[]
) {
  if (!global.tasks || !global.tasks.has(taskId)) {
    console.error(`Task ${taskId} not found`);
    return;
  }

  const task = global.tasks.get(taskId);

  try {
    // 模拟处理时间 - 每个图像需要2-5秒
    const processingTime = Math.floor(Math.random() * 3000) + 2000;

    // 创建结果，使用模板字段
    const results = imageIds.map((imageId, index) => {
      const imageFile = imageFiles[index];

      // 为模板中的每个字段创建一个结果
      const fields: Record<string, string> = {};
      template.fields.forEach((field: any) => {
        fields[field.name] = `Extracted ${field.name} from ${imageFile.name}`;
      });

      return {
        imageId,
        imageName: imageFile.name,
        fields,
        // 添加一些元数据，仅用于演示
        metadata: {
          fileSize: imageFile.size,
          fileType: imageFile.type,
        },
      };
    });

    // 等待模拟处理时间
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // 更新任务状态为完成
    task.processing_status = "completed";
    task.request_counts.processing = 0;
    task.request_counts.succeeded = imageIds.length;
    task.ended_at = new Date().toISOString();
    task.results = results; // 存储提取结果

    global.tasks.set(taskId, task);
  } catch (error) {
    console.error(`Error processing task ${taskId}:`, error);

    // 更新任务状态为错误
    task.processing_status = "error";
    task.request_counts.processing = 0;
    task.request_counts.errored = imageIds.length;
    task.ended_at = new Date().toISOString();
    task.error = "Failed to process extraction request";

    global.tasks.set(taskId, task);
  }
}

// 增加最大请求体大小
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // 设置适当的大小限制
    },
  },
};
