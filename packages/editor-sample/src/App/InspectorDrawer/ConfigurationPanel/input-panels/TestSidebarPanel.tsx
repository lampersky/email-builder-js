import React, { useState } from 'react';

import { HeightOutlined } from '@mui/icons-material';
import { TestProps, TestPropsDefaults, TestPropsSchema } from '@lampersky/block-test';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import SliderInput from './helpers/inputs/SliderInput';

type TestSidebarPanelProps = {
  data: TestProps;
  setData: (v: TestProps) => void;
};
export default function TestSidebarPanel({ data, setData }: TestSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = TestPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      //setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Spacer block">
      <SliderInput
        label="Height"
        iconLabel={<HeightOutlined sx={{ color: 'text.secondary' }} />}
        units="px"
        step={4}
        min={4}
        max={128}
        defaultValue={data.props?.height ?? TestPropsDefaults.height}
        onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
      />
    </BaseSidebarPanel>
  );
}
