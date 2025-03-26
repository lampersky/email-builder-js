import React, { CSSProperties } from 'react';
import { z } from 'zod';

export const TestPropsSchema = z.object({
  props: z
    .object({
      height: z.number().optional().nullish(),
    })
    .default({}),
});

export type TestProps = z.infer<typeof TestPropsSchema>;

export const TestPropsDefaults = {
  height: 16,
};

export function Test({ props: { height } }: TestProps) {
  const style: CSSProperties = {
    height: getHeight(height),
  };
  return <div style={style} />;
}

function getHeight(height: number | null | undefined) {
  if (typeof height !== 'number') {
    return 16;
  }
  return height >= 0 ? height : 16;
}