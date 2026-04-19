import React from 'react';
import {
    Toolbar,
    IconButton,
    Tooltip,
    TextField,
    Box,
    Badge,
    InputAdornment,
    Typography,
    Select,
    MenuItem,
    useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';
import InsightsIcon from '@mui/icons-material/Insights';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { alpha, useTheme } from '@mui/material/styles';
import { useOrbmobileI18n } from '../../../i18n';

export const CTableToolbar = (props: any) => {
    const { t } = useOrbmobileI18n();
    const theme = useTheme();
    const isPhoneViewport = useMediaQuery(theme.breakpoints.down('sm'));
    const FONT_SIZE_SMALL = '0.85rem';
    const actionNodes = Array.isArray(props.actions) ? props.actions : props.actions ? [props.actions] : [];
    const extraToolNodes = Array.isArray(props.extraTools) ? props.extraTools : props.extraTools ? [props.extraTools] : [];
    const customToolNodes = [...actionNodes, ...extraToolNodes];
    const rowsPerPage = typeof props.rowsPerPage === 'number' ? props.rowsPerPage : 20;
    const rowsPerPageOptions = Array.isArray(props.rowsPerPageOptions) && props.rowsPerPageOptions.length > 0
        ? props.rowsPerPageOptions
        : [20, 50, 100, -1];
    const totalCount = typeof props.count === 'number' ? props.count : 0;
    const currentPage = Math.max(0, typeof props.page === 'number' ? props.page : 0);
    const totalPages = rowsPerPage === -1 ? 1 : Math.max(1, Math.ceil(totalCount / rowsPerPage));
    const displayPage = Math.min(currentPage + 1, totalPages);
    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1 && rowsPerPage !== -1;

    const actionStripSx = {
        display: { xs: 'grid', sm: 'flex' },
        gap: 0.75,
        alignItems: 'center',
        flexShrink: 0,
        p: 0.5,
        width: { xs: '100%', sm: 'auto' },
        gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(44px, 1fr))', sm: 'none' },
        borderRadius: { xs: 16, sm: 999 },
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.7),
        bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.5 : 0.82),
    };

    return (
        <Toolbar
            sx={{
                pl: { xs: 0.5, sm: 1.5 },
                pr: { xs: 0.5, sm: 1 },
                py: { xs: 0.5, sm: 0.25 },
                alignItems: 'stretch',
                gap: 1,
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    alignItems: { xs: 'stretch', lg: 'center' },
                    gap: 1,
                    width: '100%',
                }}
            >
                <TextField
                    size="small"
                    placeholder={t('table.toolbar.searchPlaceholder')}
                    value={props.filterText}
                    onChange={(e) => props.setFilterText(e.target.value)}
                    InputProps={{
                        sx: {
                            fontSize: FONT_SIZE_SMALL,
                            borderRadius: 999,
                            '& .MuiInputBase-input': {
                                fontSize: FONT_SIZE_SMALL,
                                color: 'text.primary',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                fontSize: FONT_SIZE_SMALL,
                                opacity: 1,
                            },
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: '100%',
                        flex: { lg: '1 1 320px' },
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        flexWrap: 'wrap',
                        width: { xs: '100%', lg: 'auto' },
                        px: { xs: 1, sm: 1.2 },
                        py: { xs: 0.85, sm: 0.5 },
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.55),
                        bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.42 : 0.72),
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: FONT_SIZE_SMALL, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                            {t('table.toolbar.itemsPerPage')}
                        </Typography>
                        <Select
                            size="small"
                            variant="standard"
                            value={rowsPerPage}
                            disableUnderline
                            onChange={(event) => props.onRowsPerPageChange?.(Number(event.target.value))}
                            sx={{
                                fontSize: FONT_SIZE_SMALL,
                                fontWeight: 700,
                                color: 'text.primary',
                                minWidth: 64,
                                '& .MuiSelect-select': { py: 0.25, pr: '16px !important' },
                                '& .MuiSvgIcon-root': { color: 'text.primary' },
                            }}
                        >
                            {rowsPerPageOptions.map((option: number) => (
                                <MenuItem key={`rows-per-page-${option}`} value={option} sx={{ fontSize: FONT_SIZE_SMALL }}>
                                    {option === -1 ? t('common.all') : option}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35, ml: { lg: 0.5 } }}>
                        <IconButton
                            size="small"
                            onClick={() => props.onPageChange?.(Math.max(currentPage - 1, 0))}
                            disabled={!canGoPrev}
                            sx={{ p: 0.35, color: 'text.primary' }}
                        >
                            <KeyboardArrowLeftIcon fontSize="small" />
                        </IconButton>
                        <Typography
                            sx={{
                                fontSize: FONT_SIZE_SMALL,
                                fontWeight: 700,
                                minWidth: isPhoneViewport ? 92 : 108,
                                textAlign: 'center',
                                color: 'text.primary',
                            }}
                        >
                            {t('table.toolbar.pageOf', { current: displayPage, total: totalPages })}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => props.onPageChange?.(Math.min(currentPage + 1, totalPages - 1))}
                            disabled={!canGoNext}
                            sx={{ p: 0.35, color: 'text.primary' }}
                        >
                            <KeyboardArrowRightIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: 0.85,
                    alignItems: { xs: 'stretch', sm: 'center' },
                    width: '100%',
                    overflowX: 'hidden',
                    pb: { xs: 0.25, md: 0 },
                    flexWrap: 'wrap',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {customToolNodes.length > 0 && (
                    <Box sx={actionStripSx}>
                        {customToolNodes.map((node: React.ReactNode, idx: number) => (
                            <Box
                                key={`toolbar-custom-${idx}`}
                                sx={{
                                    minWidth: 0,
                                    width: { xs: '100%', sm: 'auto' },
                                    '& .MuiButton-root': {
                                        width: { xs: '100%', sm: 'auto' },
                                    },
                                }}
                            >
                                {node}
                            </Box>
                        ))}
                    </Box>
                )}

                <Box sx={actionStripSx}>
                    <Tooltip title={t('table.toolbar.groupBy')}>
                        <IconButton sx={{ color: 'text.primary' }} onClick={(e: React.MouseEvent<HTMLElement>) => props.setGroupAnchorEl(e.currentTarget)}>
                            <Badge badgeContent={props.grouping?.length} color="primary">
                                <AccountTreeIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t('table.toolbar.summary')}>
                        <IconButton
                            sx={{ color: props.showSummary ? 'primary.main' : 'text.primary' }}
                            onClick={(e: React.MouseEvent<HTMLElement>) => props.setSummaryAnchorEl(e.currentTarget)}
                        >
                            <FunctionsIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t('table.toolbar.columns')}>
                        <IconButton sx={{ color: 'text.primary' }} onClick={(e: React.MouseEvent<HTMLElement>) => props.setAnchorEl(e.currentTarget)}>
                            <ViewColumnIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t('table.toolbar.export')}>
                        <IconButton sx={{ color: 'text.primary' }} onClick={props.handleExport}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>

                    {props.onOpenGraphReport && (
                        <Tooltip title={t('table.toolbar.graphicReport')}>
                            <IconButton sx={{ color: 'text.primary' }} onClick={props.onOpenGraphReport}>
                                <InsightsIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {props.onLayoutSave && !props.layoutManager && (
                        <Tooltip title={t('table.toolbar.saveLayout')}>
                            <IconButton sx={{ color: 'text.primary' }} onClick={(e: React.MouseEvent<HTMLElement>) => props.onLayoutSave(e)}>
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {(props.showCreateButton || props.showEditButton || props.showDeleteButton) && (
                    <Box sx={actionStripSx}>
                        {props.showCreateButton && (
                            <Tooltip title={t('table.toolbar.newItem')}>
                                <IconButton onClick={props.onOpenCreateDialog} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {props.showEditButton && (
                            <Tooltip title={t('table.toolbar.editItem')}>
                                <span>
                                    <IconButton
                                        onClick={props.onOpenEditDialog}
                                        color="primary"
                                        disabled={Boolean(props.editDisabled)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}

                        {props.showDeleteButton && (
                            <Tooltip title={t('table.toolbar.deleteItem')}>
                                <span>
                                    <IconButton
                                        onClick={props.onOpenDeleteConfirm}
                                        color="error"
                                        disabled={Boolean(props.deleteDisabled)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                )}

                {props.layoutManager}
            </Box>
        </Toolbar>
    );
};
