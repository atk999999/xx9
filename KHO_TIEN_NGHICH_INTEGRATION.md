# Kho Tiên Nghịch trong P999

- Kho gốc giữ nguyên: `KHO_TIEN_NGHICH/knowledge/tien-nghich/`.
- Bản web phục vụ từ: `public/knowledge/tien-nghich/` (500 packs + chỉ mục).
- Truy xuất theo chương: `shared/tienNghichKnowledge.ts`, sử dụng `getTienNghichChapter(id)` hoặc `getTienNghichContext(ids)`.
- Các JSON chương cũ vẫn được giữ để tránh phá vỡ chức năng chưa kiểm chứng.
- Chưa tự động nối dữ liệu này vào mọi lời gọi Gemini: cần xác định luồng kể chuyện thích hợp và kiểm thử trước khi thay đổi prompt.
- Kiểm tra chỉ mục 2.095 ID khớp với nội dung pack; KHÔNG đồng nghĩa đối chiếu nội dung 100% với EPUB gốc.
