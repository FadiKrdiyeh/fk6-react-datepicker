import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [react(), dts()],
    build: {
        lib: {
            entry: "src/index.ts",
            name: "FKReactDatePicker",
            fileName: (format) => `fk-react-datepicker.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom", "moment", "moment-hijri"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    moment: "moment",
                    "moment-hijri": "moment",
                },
            },
        },
    },
});
