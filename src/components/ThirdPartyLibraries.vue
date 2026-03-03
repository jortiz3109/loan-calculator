<template>
  <div class="grow bg-base-200 flex flex-col items-center justify-start p-4 gap-6">
    <div class="w-full max-w-5xl card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body">
        <h2 class="card-title text-2xl">Third-party libraries</h2>
        <p class="text-base-content/70">
          This project uses the following external libraries and tools.
        </p>

        <div class="overflow-x-auto mt-2">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Library</th>
                <th>Version</th>
                <th>Type</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>vue</td>
                <td>^3.5.25</td>
                <td>Dependency</td>
                <td>Core UI framework used to build the app.</td>
              </tr>
              <tr>
                <td>zod</td>
                <td>^4.3.6</td>
                <td>Dependency</td>
                <td>Schema-based input validation for calculator forms.</td>
              </tr>
              <tr>
                <td>daisyui</td>
                <td>^5.5.19</td>
                <td>Dependency</td>
                <td>Prebuilt Tailwind UI components and theme primitives.</td>
              </tr>
              <tr>
                <td>tailwindcss</td>
                <td>^4.2.0</td>
                <td>Dev dependency</td>
                <td>Utility-first CSS framework for styling.</td>
              </tr>
              <tr>
                <td>vite</td>
                <td>^7.3.1</td>
                <td>Dev dependency</td>
                <td>Development server and build tool.</td>
              </tr>
              <tr>
                <td>@vitejs/plugin-vue</td>
                <td>^6.0.2</td>
                <td>Dev dependency</td>
                <td>Enables Vue SFC support in Vite.</td>
              </tr>
              <tr>
                <td>typescript</td>
                <td>^5.9.3</td>
                <td>Dev dependency</td>
                <td>Static typing for maintainability and safety.</td>
              </tr>
              <tr>
                <td>vue-tsc</td>
                <td>^3.2.4</td>
                <td>Dev dependency</td>
                <td>Type checking for Vue + TypeScript code.</td>
              </tr>
              <tr>
                <td>vitest</td>
                <td>^4.0.18</td>
                <td>Dev dependency</td>
                <td>Unit test runner.</td>
              </tr>
              <tr>
                <td>@vue/test-utils</td>
                <td>^2.4.6</td>
                <td>Dev dependency</td>
                <td>Helpers for testing Vue components.</td>
              </tr>
              <tr>
                <td>jsdom</td>
                <td>^28.1.0</td>
                <td>Dev dependency</td>
                <td>Browser-like DOM environment for tests.</td>
              </tr>
              <tr>
                <td>@vitest/coverage-v8</td>
                <td>^4.0.18</td>
                <td>Dev dependency</td>
                <td>Code coverage reporting for Vitest.</td>
              </tr>
              <tr>
                <td>@tailwindcss/vite</td>
                <td>^4.2.0</td>
                <td>Dev dependency</td>
                <td>Tailwind integration plugin for Vite.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
