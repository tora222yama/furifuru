import * as React from 'react';
import {
  Box,
  Container,
  Button,
  Alert,
  Typography,
  Paper,
} from '@mui/material';
import { Head } from '@inertiajs/react';

interface IProps {
  token: string;
}

export const ApiTokenShow: React.FC<IProps> = ({ token }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head title="シフト API トークン - 表示" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          シフト API トークン - 初回表示
        </Typography>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            ⚠️ 重要なお知らせ
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            このトークンはこの画面でのみ表示されます。今後表示されることはありません。
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            用途は GAS からの <strong>/api/shift_schedule/export</strong>{' '}
            呼び出し専用です。
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            必ず安全な場所に保管してください。
          </Typography>
        </Alert>

        {/* トークン表示欄 */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            トークン
          </Typography>
          <Box
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: 1,
              overflowX: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
              }}
            >
              {token}
            </pre>
          </Box>
          <Button
            variant="contained"
            color={copied ? 'success' : 'primary'}
            onClick={handleCopyToken}
          >
            {copied ? '✓ コピーしました' : 'コピー'}
          </Button>
        </Paper>

        {/* 保管方法の推奨 */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            推奨される保管方法
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>KeePass / 1Password などのパスワードマネージャー</li>
            <li>デプロイシステムの環境変数またはシークレット設定</li>
            <li>GAS プロジェクトのスクリプトプロパティ</li>
            <li>AWS Secrets Manager などのシークレット管理サービス</li>
          </ul>
        </Alert>

        {/* アクション */}
        <Box>
          <Button variant="contained" href="/admin/api-tokens">
            戻る
          </Button>
        </Box>
      </Container>
    </>
  );
};
