// components/task-card.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TaskStatus = {
  id: string;
  type: string;
  processing_status: string;
  request_counts: {
    processing: number;
    succeeded: number;
    errored: number;
    canceled: number;
    expired: number;
  };
  ended_at: string | null;
  created_at: string;
  expires_at: string;
  cancel_initiated_at: string | null;
  results_url: string | null;
  results?: any[];
  error?: string;
};

type TaskCardProps = {
  initialTask: TaskStatus;
  onTaskComplete: (results: any[]) => void;
};

export function TaskCard({ initialTask, onTaskComplete }: TaskCardProps) {
  const [task, setTask] = useState<TaskStatus>(initialTask);
  const [isPolling, setIsPolling] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // 计算任务进度
  const calculateProgress = () => {
    const { processing, succeeded, errored, canceled, expired } =
      task.request_counts;
    const total = processing + succeeded + errored + canceled + expired;
    if (total === 0) return 0;
    return Math.floor(
      ((succeeded + errored + canceled + expired) / total) * 100
    );
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 获取状态标签的颜色和文本
  const getStatusBadge = () => {
    switch (task.processing_status) {
      case "in_progress":
        return {
          color: "bg-blue-500",
          text: "Processing",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
      case "completed":
        return {
          color: "bg-green-500",
          text: "Completed",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "error":
        return {
          color: "bg-red-500",
          text: "Error",
          icon: <XCircle className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          color: "bg-gray-500",
          text: task.processing_status,
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
        };
    }
  };

  // 轮询任务状态
  useEffect(() => {
    if (!isPolling) return;

    // 如果任务已完成或出错，停止轮询
    if (
      task.processing_status === "completed" ||
      task.processing_status === "error"
    ) {
      setIsPolling(false);

      // 如果任务完成并且有结果，调用回调函数
      if (task.processing_status === "completed" && task.results) {
        onTaskComplete(task.results);
      }
      return;
    }

    // 设置轮询间隔
    const pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/tasks/${task.id}`);

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const updatedTask = await response.json();
        setTask(updatedTask);

        // 如果任务完成或出错，停止轮询
        if (
          updatedTask.processing_status === "completed" ||
          updatedTask.processing_status === "error"
        ) {
          clearInterval(pollingInterval);
          setIsPolling(false);

          // 如果任务完成并且有结果，调用回调函数
          if (
            updatedTask.processing_status === "completed" &&
            updatedTask.results
          ) {
            onTaskComplete(updatedTask.results);
            toast.success("Extraction completed successfully!");
          } else if (updatedTask.processing_status === "error") {
            toast.error("Extraction failed", {
              description: updatedTask.error || "An unknown error occurred",
            });
          }
        }
      } catch (error) {
        console.error("Error polling task status:", error);
        setRetryCount((prev) => prev + 1);

        // 如果重试次数超过10次，停止轮询
        if (retryCount > 10) {
          clearInterval(pollingInterval);
          setIsPolling(false);
          toast.error("Failed to get task status after multiple retries");
        }
      }
    }, 2000); // 每2秒轮询一次

    // 清理函数
    return () => {
      clearInterval(pollingInterval);
    };
  }, [
    task.id,
    task.processing_status,
    isPolling,
    retryCount,
    onTaskComplete,
    task.results,
  ]);

  // 手动刷新任务状态
  const handleRefresh = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`);

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const updatedTask = await response.json();
      setTask(updatedTask);

      toast.info("Task status refreshed");
    } catch (error) {
      console.error("Error refreshing task status:", error);
      toast.error("Failed to refresh task status");
    }
  };

  const statusBadge = getStatusBadge();
  const progress = calculateProgress();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Extraction Task
          </CardTitle>
          <Badge
            className={`${statusBadge.color} text-white flex items-center`}
          >
            {statusBadge.icon}
            {statusBadge.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Task ID:</span>
            <span className="font-mono text-xs">{task.id}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Created:</span>
            <span>{formatDate(task.created_at)}</span>
          </div>

          {task.ended_at && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Completed:</span>
              <span>{formatDate(task.ended_at)}</span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress:</span>
              <div className="flex items-center">
                <span>{progress}%</span>
                {task.processing_status === "in_progress" && (
                  <div className="ml-2 animate-spin">
                    <RefreshCw className="h-3 w-3 text-blue-500" />
                  </div>
                )}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
            <div className="text-center p-1 bg-blue-100 rounded text-xs">
              <div>Processing</div>
              <div className="font-semibold">
                {task.request_counts.processing}
              </div>
            </div>
            <div className="text-center p-1 bg-green-100 rounded text-xs">
              <div>Succeeded</div>
              <div className="font-semibold">
                {task.request_counts.succeeded}
              </div>
            </div>
            <div className="text-center p-1 bg-red-100 rounded text-xs">
              <div>Failed</div>
              <div className="font-semibold">{task.request_counts.errored}</div>
            </div>
            <div className="text-center p-1 bg-gray-100 rounded text-xs">
              <div>Other</div>
              <div className="font-semibold">
                {task.request_counts.canceled + task.request_counts.expired}
              </div>
            </div>
          </div>
        </div>

        {!isPolling && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        )}

        {task.processing_status === "error" && task.error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            <div className="font-semibold">Error:</div>
            <div>{task.error}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
