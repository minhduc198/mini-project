import http from "@/src/lib/http";

export interface UploadImageResponse {
  url: string;
  path: string;
}

export interface DeleteImageRequest {
  path: string;
}

export class UploadService {
  static async uploadImage(file: File): Promise<UploadImageResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await http.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data as UploadImageResponse;
    } catch (error) {
      throw new Error(
        `Lỗi khi upload ảnh: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  static async updateImage(
    file: File,
    oldPath: string,
  ): Promise<UploadImageResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("oldPath", oldPath);

      const response = await http.put("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data as UploadImageResponse;
    } catch (error) {
      throw new Error(
        `Lỗi khi cập nhật ảnh: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  static async deleteImage(path: string): Promise<void> {
    try {
      await http.delete("/upload", { data: { path } });
    } catch (error) {
      throw new Error(
        `Lỗi khi xóa ảnh: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export const uploadImage = (file: File) => UploadService.uploadImage(file);

export const updateImage = (file: File, oldPath: string) =>
  UploadService.updateImage(file, oldPath);

export const deleteImage = (path: string) => UploadService.deleteImage(path);
