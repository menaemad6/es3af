import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import {marked} from 'marked';

const exportChat = ({chatInfo, userInfo, chatMessages}) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Starting PDF export with:", { chatInfo, messagesCount: chatMessages?.length });
      
      // Create a temporary HTML element to render the PDF content
      const element = document.createElement('div');
      element.className = "pdf-container";
      
      // Set the title and basic info
      const title = chatInfo?.title || 'Medical Chat Transcript';
      const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const date = new Date().toISOString().split('T')[0];
      const filename = `es3af_chat_${sanitizedTitle}_${date}.pdf`;
      
      // Add CSS styling
      const styleContent = `
        .pdf-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
          line-height: 1.6;
          width: 210mm;
          min-height: 297mm;
          padding: 25mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          color: #2563eb;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: #1e40af;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e40af;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .info-grid div {
          font-size: 14px;
          color: #475569;
        }
        .message {
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
        .message:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .message-header {
          color: #64748b;
          font-size: 13px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .message-user {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
        }
        .message-bot {
          background-color: #f8fafc;
          border-left: 4px solid #10b981;
        }
        .message-content {
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 14px;
          color: #334155;
        }
        .arabic {
          font-family: 'Noto Sans Arabic', 'Arial', sans-serif;
          direction: rtl;
          text-align: right;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #64748b;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }
        /* Enhanced Markdown styling */
        .message-content code {
          background-color: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 0.9em;
          color: #0f172a;
          border: 1px solid #e2e8f0;
        }
        .message-content pre {
          background-color: #1e293b;
          padding: 15px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 15px 0;
          border: 1px solid #334155;
        }
        .message-content pre code {
          background-color: transparent;
          padding: 0;
          color: #e2e8f0;
          border: none;
          font-size: 0.95em;
        }
        .message-content p {
          margin: 12px 0;
          line-height: 1.7;
        }
        .message-content strong {
          font-weight: 600;
          color: #1e293b;
        }
        .message-content em {
          font-style: italic;
          color: #475569;
        }
        .message-content ul, .message-content ol {
          margin: 12px 0;
          padding-left: 25px;
        }
        .message-content li {
          margin: 6px 0;
          color: #334155;
        }
        .message-content blockquote {
          border-left: 4px solid #3b82f6;
          margin: 15px 0;
          padding: 12px 20px;
          background-color: #f8fafc;
          border-radius: 0 8px 8px 0;
          color: #475569;
          font-style: italic;
        }
        .message-content table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          margin: 15px 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .message-content th, .message-content td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        .message-content th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #1e293b;
        }
        .message-content tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .message-content tr:hover {
          background-color: #f1f5f9;
        }
        /* Image styling */
        .message img {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          max-width: 100%;
          height: auto;
        }
        /* Container styling */
        .container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = styleContent;
      element.appendChild(style);
      
      // Helper function to detect if text contains Arabic
      const containsArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return text && arabicPattern.test(text);
      };
      
      // Helper function to escape HTML
      const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };
      
      // Helper to format text with proper direction and markdown
      const formatText = (text, isBot = false) => {
        if (!text) return '';
        
        const escaped = escapeHtml(text);
        if (isBot) {
          // Parse markdown for bot messages
          const parsed = marked.parse(escaped);
          if (containsArabic(text)) {
            return `<div class="arabic">${parsed}</div>`;
          }
          return parsed;
        } else {
          // Regular text for user messages
          if (containsArabic(text)) {
            return `<div class="arabic">${escaped}</div>`;
          }
          return escaped;
        }
      };
      
      // Add content container
      const container = document.createElement('div');
      container.className = 'container';
      
      // Add header
      const header = document.createElement('div');
      header.className = 'header';
      header.innerHTML = `<h1>${formatText(title)}</h1>`;
      container.appendChild(header);
      
      // Add chat info section
      const infoSection = document.createElement('div');
      infoSection.className = 'section';
      infoSection.innerHTML = `
        <div class="section-title">Chat Information</div>
        <div class="info-grid">
          <div>Chat ID: ${escapeHtml(chatInfo?.id || 'N/A')}</div>
          <div>User: ${escapeHtml(userInfo?.name || 'Anonymous')}</div>
          <div>Created: ${chatInfo?.created_at ? new Date(chatInfo.created_at).toLocaleString() : 'N/A'}</div>
          <div>Email: ${escapeHtml(userInfo?.email || 'N/A')}</div>
          <div>Category: ${escapeHtml(chatInfo?.category || 'General')}</div>
          <div>Exported: ${new Date().toLocaleString()}</div>
        </div>
      `;
      container.appendChild(infoSection);
      
      // Add conversation section
      const conversationSection = document.createElement('div');
      conversationSection.className = 'section';
      conversationSection.innerHTML = `<div class="section-title">Conversation</div>`;
      
      // Add messages
      const messagesContainer = document.createElement('div');
      if (chatMessages && chatMessages.length > 0) {
        chatMessages.forEach(msg => {
          if (!msg) return;
          
          const isUser = msg.role === 'user';
          const sender = isUser ? 'You' : 'Es3af';
          const timestamp = msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Unknown time';
          
          const messageDiv = document.createElement('div');
          messageDiv.className = `message ${isUser ? 'message-user' : 'message-bot'}`;
          
          // Format message content with proper direction and markdown
          const content = formatText(msg.text, !isUser);
          
          messageDiv.innerHTML = `
            <div class="message-header">${timestamp} - ${sender}</div>
            <div class="message-content">${content || '[No content]'}</div>
          `;
          
          // Add images if present
          if (msg.img) {
            const imgContainer = document.createElement('div');
            imgContainer.style.marginTop = '10px';
            imgContainer.innerHTML = `<img src="${msg.img}" style="max-width: 100%; max-height: 200px;" />`;
            messageDiv.appendChild(imgContainer);
          }
          
          // Add generated images if present
          if (msg.generated_images && msg.generated_images.length > 0) {
            const imgGrid = document.createElement('div');
            imgGrid.style.display = 'flex';
            imgGrid.style.flexWrap = 'wrap';
            imgGrid.style.gap = '10px';
            imgGrid.style.marginTop = '10px';
            
            msg.generated_images.forEach(imgUrl => {
              imgGrid.innerHTML += `<img src="${imgUrl}" style="max-width: 45%; max-height: 150px;" />`;
            });
            
            messageDiv.appendChild(imgGrid);
          }
          
          messagesContainer.appendChild(messageDiv);
        });
      } else {
        messagesContainer.innerHTML = '<div class="message">No messages in this conversation</div>';
      }
      
      conversationSection.appendChild(messagesContainer);
      container.appendChild(conversationSection);
      
      // Add footer
      const footer = document.createElement('div');
      footer.className = 'footer';
      footer.innerHTML = 'Es3af Medical Assistant - For educational purposes only. Always consult with a healthcare professional for medical advice.';
      container.appendChild(footer);
      
      // Add to the main element
      element.appendChild(container);
      
      // For debugging - show how many messages are rendered
      console.log(`Rendering PDF with ${messagesContainer.children.length} messages`);
      
      // Append to document body for rendering
      document.body.appendChild(element);
      
      // Make sure the element is fully rendered and visible
      setTimeout(() => {
        // Generate PDF with html2pdf
        const options = {
          margin: [10, 10, 10, 10],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true,
            letterRendering: true 
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generate PDF
        html2pdf()
          .from(element)
          .set(options)
          .save()
          .then(() => {
            console.log("PDF generation successful");
            // Remove the temporary element
            document.body.removeChild(element);
            resolve({ success: true, filename });
          })
          .catch(error => {
            console.error('Error generating PDF:', error);
            // Remove the temporary element
            if (document.body.contains(element)) {
              document.body.removeChild(element);
            }
            reject(new Error('Failed to export chat: ' + error.message));
          });
      }, 500); // Give it 500ms to fully render
      
    } catch (error) {
      console.error('Error in PDF generation process:', error);
      reject(new Error('Failed to export chat: ' + error.message));
    }
  });
};


const useExportChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({chatInfo, userInfo, chatMessages}) => exportChat({chatInfo, userInfo, chatMessages}),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["user_chats", variables.userInfo.userId]);

      toast.success(`Chat transcript downloaded successfully.`, {
        duration: 4000,
        position: "top-center",
      });
    },
    onError: (err) => {
      console.error("Error exporting chat:", err.message);
      toast.error(`Failed to export chat: ${err.message}`, {
        duration: 4000,
        position: "top-center",
      });
    },
  });
};

export {useExportChat};
