---
to: src/components/<%= level %>/<%= h.toPascalCase(name) %>/index.stories.tsx
---

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import <%= h.toPascalCase(name) %> from ".";

export default {
  title: "Components/<%= level %>/<%= h.toPascalCase(name) %>",
  component: <%= h.toPascalCase(name) %>,
  argTypes: {},
} as ComponentMeta<typeof <%= h.toPascalCase(name) %>>;

const Template: ComponentStory<typeof <%= h.toPascalCase(name) %>> = (args) => <<%= h.toPascalCase(name) %> {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Secondary = Template.bind({});
Secondary.args = {};