/*
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { HelloWidget } from './HelloWidget';

const nameToWidget = {
  HelloWidget: HelloWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_DELETED':
      // Clean up
      break;

    default:
      break;
  }
}*/