import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
// import path from "path"

export default defineConfig({
    plugins: [react(), dts()],
    root: '.', // Root is your package folder
    server: {
        open: true,
        watch: {
            usePolling: true, // Helps with hot reload in some environments
        },
    },

    build: {
        lib: {
            // entry: path.resolve(__dirname, 'src/index.ts'),
            entry: "src/index.ts",
            name: "FKReactDatePicker",
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom", "moment", "moment-hijri"],
            output: {
                exports: "named",
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
