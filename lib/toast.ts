import { toast } from "sonner";

type ToastType = "Success" | "Error" | "Warning"

export const applyToast = (type: ToastType, message: string) => {
    switch (type) {
        case 'Success':
            toast.success(message, {
                style: {
                    backgroundColor: "#0F5132", // deep green background
                    color: "#D1E7DD",           // soft mint text
                }
            })
            break;

        case 'Warning':
            toast.warning(message, {
                style: {
                    backgroundColor: "#664D03", // warm brownish yellow background
                    color: "#FFF3CD",           // light cream text 
                }
            })
            break;

        case 'Error':
            toast.error(message, {
                style: {
                    backgroundColor: "#842029", // dark red background
                    color: "#F8D7DA",           // soft pink text
                }
            })
            break;
    }
}