import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { StyledMenu, StyledMenuItem } from './Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	AiOutlineClose,
	AiOutlineSave,
	AiFillSave,
	AiFillCloseCircle,
	AiOutlineCloseCircle,
} from 'react-icons/ai';

interface TabItem {
	key: string;
	title: string;
	modified: boolean;
}

export interface FileTabBarProps {
	index: number | null;
	items: TabItem[];
	onChange: (index: number) => void;
	onMenuClick: (event: TabMenuEvent) => void;
};

interface StyledTabsProps {
	children?: React.ReactNode;
	value: number | false;
	onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
	<Tabs
		variant='scrollable'
		selectionFollowsFocus
		scrollButtons="auto"
		{...props}
		TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
	/>
))({
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		maxWidth: 40,
		width: '100%',
		backgroundColor: '#fbc400',
	},
});

interface StyledTabProps {
	label: string;
	onMouseUp: (event: React.MouseEvent) => void;
}

const StyledTab = styled((props: StyledTabProps) => (
	<Tab disableRipple {...props}/>
))(({ theme }) => ({
	textTransform: 'none',
	fontWeight: theme.typography.fontWeightRegular,
	fontSize: theme.typography.pxToRem(15),
	marginRight: theme.spacing(1),
	color: 'rgba(255, 255, 255, 0.7)',
	'&.Mui-selected': {
		color: '#fff',
	},
	'&.Mui-focusVisible': {
		backgroundColor: 'rgba(100, 95, 228, 0.32)',
	},
}));

export type TabMenuEvent =
	"Save" |
	"SaveAll" |
	"Close" |
	"CloseOther" |
	"CloseAll";

export default function FileTabBar(props: FileTabBarProps) {
	const {index, items = [], onChange, onMenuClick} = props;
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);
	const [value, setValue] = useState<number | false>(false);

	if (index !== null && index !== value) {
		setValue(index);
	} else if (index === null && value !== false) {
		setValue(false);
	}

	const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
		onChange(newValue);
	};

	const mouseUp = (event: React.MouseEvent) => {
		if (event.button === 2) {
			setAnchorEl(event.currentTarget);
		}
	};

	const handleClose = (event: TabMenuEvent) => {
		setAnchorEl(null);
		onMenuClick(event);
	};

	return (
		<Box width={'100%'}>
			<StyledTabs
				value={value}
				onChange={handleChange}
				aria-label="styled tabs"
			>
				{
					items.map((item) =>
						<StyledTab
							onMouseUp={mouseUp}
							key={item.key}
							label={item.modified ? '*' + item.title : item.title}
						/>
					)
				}
			</StyledTabs>
			<StyledMenu
				id="dora-menu"
				anchorEl={anchorEl}
				keepMounted
				autoFocus={false}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<StyledMenuItem onClick={() => handleClose('Save')}>
					<ListItemIcon>
						<AiOutlineSave/>
					</ListItemIcon>
					<ListItemText primary="Save"/>
				</StyledMenuItem>
				<StyledMenuItem onClick={() => handleClose('SaveAll')}>
					<ListItemIcon>
						<AiFillSave/>
					</ListItemIcon>
					<ListItemText primary="Save All"/>
				</StyledMenuItem>
				<StyledMenuItem onClick={() => handleClose('Close')}>
					<ListItemIcon>
						<AiOutlineClose/>
					</ListItemIcon>
					<ListItemText primary="Close"/>
				</StyledMenuItem>
				<StyledMenuItem onClick={() => handleClose('CloseOther')}>
					<ListItemIcon>
						<AiOutlineCloseCircle/>
					</ListItemIcon>
					<ListItemText primary="Close Other"/>
				</StyledMenuItem>
				<StyledMenuItem onClick={() => handleClose('CloseAll')}>
					<ListItemIcon>
						<AiFillCloseCircle/>
					</ListItemIcon>
					<ListItemText primary="Close All"/>
				</StyledMenuItem>
			</StyledMenu>
		</Box>
	);
}
