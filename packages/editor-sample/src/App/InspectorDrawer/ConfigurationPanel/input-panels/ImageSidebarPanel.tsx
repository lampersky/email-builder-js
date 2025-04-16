import React, { useState } from 'react';

import {
  VerticalAlignBottomOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignTopOutlined,
} from '@mui/icons-material';
import { Box, Button, Card, CardMedia, Grid, Modal, Stack, ToggleButton, Typography } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};

const imageList = [
  'https://picsum.photos/id/1018/1280/930',
  'https://picsum.photos/id/1019/1280/930',
  'https://picsum.photos/id/1020/1280/930',
  'https://picsum.photos/id/1021/1280/930',
  'https://picsum.photos/id/1022/1280/930',
  'https://picsum.photos/id/1023/1280/930',
  'https://picsum.photos/id/1024/1280/930',
  'https://picsum.photos/id/1025/1280/930',
  'https://picsum.photos/id/1026/1280/930',
  'https://picsum.photos/id/1027/1280/930',
  'https://picsum.photos/id/1028/1280/930',
  'https://picsum.photos/id/1029/1280/930',
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageSelect = (url: string) => {
    updateData({ ...data, props: { ...data.props, url } });
    handleClose();
  };

  return (
    <BaseSidebarPanel title="Image block">
      <TextInput
        label="Source URL"
        defaultValue={data.props?.url ?? ''}
        onChange={(v) => {
          const url = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, url } });
        }}
      />

      <Button variant="contained" onClick={handleOpen}>
        Open gallery
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Choose an Image
          </Typography>
          <Grid container spacing={2}>
            {imageList.map((url) => (
              <Grid item xs={4} key={url}>
                <Card onClick={() => handleImageSelect(url)} sx={{ cursor: 'pointer' }}>
                  <CardMedia component="img" image={url} alt="Image option" />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

      <TextInput
        label="Alt text"
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
      />
      <TextInput
        label="Click through URL"
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          label="Width"
          defaultValue={data.props?.width}
          onChange={(width) => updateData({ ...data, props: { ...data.props, width } })}
        />
        <TextDimensionInput
          label="Height"
          defaultValue={data.props?.height}
          onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
        />
      </Stack>

      <RadioGroupInput
        label="Alignment"
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) => updateData({ ...data, props: { ...data.props, contentAlignment } })}
      >
        <ToggleButton value="top">
          <VerticalAlignTopOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="middle">
          <VerticalAlignCenterOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="bottom">
          <VerticalAlignBottomOutlined fontSize="small" />
        </ToggleButton>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
