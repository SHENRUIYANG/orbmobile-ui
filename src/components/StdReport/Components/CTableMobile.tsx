import { Box, Typography } from '@mui/material';
import { useOrbmobileI18n } from '../../../i18n';

export const CTableMobile = (_props: any) => {
    const { t } = useOrbmobileI18n();
    return (
        <Box sx={{ p: 2 }}>
            <Typography>{t('table.mobile.notImplemented')}</Typography>
        </Box>
    );
};
