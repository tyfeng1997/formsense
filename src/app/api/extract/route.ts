// app/api/extract/route.ts
import { NextRequest, NextResponse } from "next/server";

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

    // 在实际场景中，这里会处理图像并提取数据
    // 现在我们只是返回模拟结果

    // 创建结果，使用模板字段
    const mockResults = imageIds.map((imageId, index) => {
      const imageFile = imageFiles[index];

      // 为模板中的每个字段创建一个结果
      const fields: Record<string, string> = {};
      template.fields.forEach((field: any) => {
        fields[field.name] = `TEST PASS - ${field.name}`;
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

    // 模拟处理时间
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ results: mockResults });
  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      { error: "Failed to process extraction request" },
      { status: 500 }
    );
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
