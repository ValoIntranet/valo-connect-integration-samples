import * as React from "react";
import { Dropdown } from '@fluentui/react-northstar/dist/es/components/Dropdown/Dropdown';
import styles from '../extensions/connectMeXero/components/ConnectMeXeroConfiguration.module.scss';
import { Label } from '@fluentui/react-northstar/dist/es/components/Label/Label';
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo';
import * as strings from 'ConnectMeXeroApplicationCustomizerStrings';

export function SelectSizeDropDown(
	props: React.PropsWithChildren<{
		onSelectionChanged: (option: ConnectWidgetSize) => void;
		initialSize?: ConnectWidgetSize;
	}>
) {
	const [selectedSize, setSelectedSize] = React.useState<ConnectWidgetSize>(props.initialSize || ConnectWidgetSize.Single);

	const options = [
		{
			key: ConnectWidgetSize.Single,
			text: strings.WidgetSizeSingleColumn,
		},
		{
			key: ConnectWidgetSize.Double,
			text: strings.WidgetSizeTwoColumns,
		},
		{
			key: ConnectWidgetSize.Triple,
			text: strings.WidgetSizeThreeColumns,
		},
	];

	const onSelectionChanged = (event, option) => {
		const newSize = options.filter(x => x.text == option.value);
		if (newSize.length > 0) {
            setSelectedSize(newSize[0].key as ConnectWidgetSize);
            props.onSelectionChanged(newSize[0].key);
    
        }
	};

	return (
		<>
			<Label className={styles.configPanelFieldLabel}>{strings.ConnectWidgetSize}</Label>
			<div className={styles.configPanelDropdownWrapper}>
				<Dropdown
					data-automation-id="widget-config-size-dd"
					className={styles.configPanelDropdown}
					inverted
					fluid
					placeholder={options.filter(x => x.key === selectedSize)[0].text}
					items={options.map(x => x.text)}
					onChange={onSelectionChanged}
				/>
			</div>
		</>
	);
}
