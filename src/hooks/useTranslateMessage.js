import { useQuery } from "@tanstack/react-query";
import { translateMessage } from "../services/supabaseFunctions";
import { toast } from "sonner";

const useTranslateMessage = (msg, options = {}) => {
  return useQuery({
    queryKey: ["translate", msg],
    queryFn: () => translateMessage(msg),
    enabled: !!msg, // Only run the query if msg is provided
    onSuccess: (data) => {
      toast.success("Message translated successfully.", {
        duration: 4000,
        position: "top-center",
      });
    },
    onError: (err) => {
      toast.error("Error translating message.", {
        duration: 4000,
        position: "top-center",
      });
      console.error("Error translating message:", err);
    },
    ...options, // Allow passing additional options
  });
};

export { useTranslateMessage };
