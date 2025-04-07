// app/api/extract/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, imageIds } = body;

    // 这里应该是实际的提取逻辑。现在我们只返回模拟数据
    const mockResults = imageIds.map((imageId) => {
      return {
        imageId,
        imageName: `Image-${imageId.substring(0, 8)}`,
        fields: {
          // 这里会根据模板返回不同的字段
          // 目前我们只是返回 "TEST PASS"
          ...Object.fromEntries(
            Array.from({ length: 5 }, (_, i) => [`Field${i + 1}`, `TEST PASS`])
          ),
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
