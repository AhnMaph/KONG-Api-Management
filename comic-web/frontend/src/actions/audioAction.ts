import axios from 'axios';
const baseURL = 'http://localhost:8000'
export const audioText = async (text: string, nameFile: string) => {
    try {
          const config = {
            headers: { 'Content-Type': 'audio/mpeg' },
            }
          const response = await axios.post(
              `${baseURL}/api/audio/tts/${nameFile}/`, 
              {text:text}, 
              config
          );
        console.log("Thông tin tải: ",response.headers); // Debug kết quả
    } catch (error) {
        console.error("Lỗi tải audio:", error);
            throw error;
    }
};
export function slugifyVietnamese(text: string): string {
    const from =
      "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ";
    const to =
      "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy";
  
    text = text.toLowerCase();
    for (let i = 0; i < from.length; i++) {
      text = text.replace(new RegExp(from[i], "g"), to[i]);
    }
  
    text = text.replace(/\s+/g, "-"); // thay space bằng -
    text = text.replace(/[^a-z0-9\-]/g, ""); // chỉ giữ a-z, 0-9, -
    return text.replace(/^-+|-+$/g, ""); // loại bỏ dấu - ở đầu/cuối
  }