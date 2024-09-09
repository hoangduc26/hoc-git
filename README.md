# React - Storybook – SCSS Setup with TypeScript <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px" height="25px">

### Hi, I'm so glad you're here!!

## Features

- [`ReactJS v18`](https://reactjs.org/) + [`TypeScript`](https://www.typescriptlang.org/docs/handbook/intro.html)
- [`React Router V6`](https://reacttraining.com/blog/react-router-v6-pre/)
- [`Storybook v6`](https://storybook.js.org/)
- [`ESLint`](https://eslint.org/) + [`Prettier`](https://prettier.io/) + [`Stylelint`](https://stylelint.io/)
- [`SCSS`](https://sass-lang.com/documentation/)
- [`Hygen`](hygen.io)
- [`Husky`](https://github.com/typicode/husky) + [`Lint-staged`](https://github.com/okonet/lint-staged)
- [`Atomic Design`](https://atomicdesign.bradfrost.com/chapter-2/)

## Files/Directories

| Path                 | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| /\_templates/        | contains scaffolding templates based on `Hygen`                     |
| /.husky              | settings for `Husky`                                                |
| /.storybook/         | contains Storybook config files                                     |
| /.vscode/            | settings for `Visual Studio Code` workspace                         |
| /patches/            | settings for `import globbing in scss` with babel                   |
| /public/             | root folder that gets served up as our next app.                    |
| /.hygen              | settings for `Hygen`                                                |
| /.eslintrc           | settings for `ESLint`                                               |
| /.prettierrc         | settings for `Prettier`                                             |
| /.stylelintrc.json   | settings for `Stylelint`                                            |
| /tsconfig.json       | settings for `TypeScript`                                           |
| /lint-staged...      | config testing and building before committing                       |
| /src                 |                                                                     |
| \_\_\_\_/assets/     | contains images, icons, fonts, dummyData                            |
| \_\_\_\_/components/ | contains Atomic Design components                                   |
| \_\_\_\_/container/  | contains Logic handler                                              |
| \_\_\_\_/hooks/      | contains custom hooks                                               |
| \_\_\_\_/pages/      | contains handle fetching data api                                   |
| \_\_\_\_/routes/     | contains handle router                                              |
| \_\_\_\_/stories/    | welcome to storybook (recommend delete this folder)                 |
| \_\_\_\_/store/      | contains shared store (Redux, Recoil,...)                           |
| \_\_\_\_/services/   | contains shared services                                            |
| \_\_\_\_/styles/     | contains styles: breakpoints, colors, font, mixin, function, global |
| \_\_\_\_/types/      | contains shared types                                               |
| \_\_\_\_/utils/      | contains functions, schemas, constants, ...others                   |

## Command Line

| Path            | Purpose                 |
| --------------- | ----------------------- |
| yarn start      | start the project       |
| yarn storybook  | run the storybook       |
| gen:component   | generate new component  |
| gen:page        | generate new page       |
| yarn lint       | run to check the syntax |
| yarn lint:fix   | run to fix the syntax   |
| yarn lint:style | run to format code scss |
| yarn prettier   | run to format code      |

---

## Extension

- vscode-eslint <img src="https://images.credly.com/images/e6eebd0c-6a17-4c06-b172-02ca9f6beb06/eslint.png" width="25px" height="25px">
- prettier-vscode <img src="https://seeklogo.com/images/P/prettier-logo-D5C5197E37-seeklogo.com.png" width="25px" height="25px">
- sonarlint-vscode <img src="https://www.sonarlint.org/sonarlint-og-image.png" width="25px" height="25px">
- vscode-stylelint <img src="https://pic.vsixhub.com/3c/a8/ec35b5a3-9802-4c68-b5ff-e85f19ec0977-logo.png" width="25px" height="25px">

---

### `Abem`

<https://css-tricks.com/abem-useful-adaptation-bem/>

**Note: Use only the `Single_Underscore(_) && Single-Dash(-)` format for `className`.**

```tsx
//GOOD 🏆🏆🏆
export const Sample = () => (
  <div className='a-sample'>
    <span className='a-sample_title'>Title</span>
  </div>
);

//NOT GOOD 💩💩💩
export const Sample = () => (
  <div className='a--sample'>
    <span className='a--sample__title'>Title</span>
  </div>
);
```

**Note: The `className` must be formatted as `block_element-modifier`. But `Sometimes` it will be formatted as `block_element_element-modifier`.**

```tsx
//GOOD 🏆🏆🏆
export const Sample = () => (
  <div className='a-sample'>
    <span className='a-sample_element'>One Element</span>
  </div>
);

export const Sample = () => (
  <div className='a-sample'>
    <span className='a-sample_element1_element2'>Two elements</span>
  </div>
);

export const Sample = () => (
  <div className='a-sample'>
    <span className='a-sample_element1_element2-primary'>Two elements</span>
  </div>
);

//NOT GOOD 💩💩💩
export const Sample = () => (
  <div className='a-sample'>
    <span className='a-sample_element1_element2_element3'>Greater than 2 elements</span>
  </div>
);
```

### `Components`

- Use only `React-Hook`
- Follow the `rules of hook` (<https://reactjs.org/docs/hooks-rules.html>)

**Note: Use `// eslint-disable-next-line react-hooks/exhaustive-deps` when you want to avoid checking of the `useEffect` syntax (also on `useMemo & useCallback`)**

```tsx
  useEffect(() => {
    Todo Something...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

**Note: Use simple syntax when the component has no properties.**

```tsx
//GOOD 🏆🏆🏆
export const Component = () => <div>Without children...</div>;

export const Component: React.FC = ({ children }) => <div>{children}</div>;

//NOT GOOD 💩💩💩
export const Component: React.FC = () => <div>Without children...</div>;
```

**Note: Clearly define the data type of the property.**

```tsx
//GOOD 🏆🏆🏆
interface Props {
  title: string;
}

//NOT GOOD 💩💩💩
interface Props {
  title: any;
}
```

**Note: Please leave TODO when you encounter some unresolved issues immediately.**

```tsx
export const Component = () => {
  // TODO: bla...bla...bla
  const Problems = "Problems";

  return <div>Todo Something...</div>;
};
```

**Note: Use the filename as the component name. For example, Example.tsx should have a reference name of Example. However, for root components of a directory, use index.jsx as the filename and use the directory name as the component name:**

```tsx
//GOOD 🏆🏆🏆
import Example from "components/atoms/Example";

//NOT GOOD 💩💩💩
import Example from "components/atoms/Example/index";
```
# Blog-Toolkit-Saga-Axios-Paginate
