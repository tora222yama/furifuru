import * as React from 'react';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
  Typography,
  Paper,
  Stack,
  Link,
} from '@mui/material';
import { Head, useForm } from '@inertiajs/react';

export interface IToken {
  id: number;
  name: string;
  created_at: string;
  last_used_at: string;
  expires_at: string;
  is_expired: boolean;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
}

interface IProps {
  user: IUser;
  tokens: IToken[];
}

export const ApiTokenManagement: React.FC<IProps> = ({ user, tokens }) => {
  const { post, processing } = useForm();

  const handleIssueToken = () => {
    if (!confirm('新しいトークンを発行します。よろしいですか？')) {
      return;
    }
    post('/admin/api-tokens/issue');
  };

  const handleRotateToken = () => {
    if (
      !confirm(
        '既存のトークンをすべて削除し、新しいトークンを発行します。よろしいですか？',
      )
    ) {
      return;
    }
    post('/admin/api-tokens/rotate');
  };

  const handleDeleteToken = (tokenId: number) => {
    if (!confirm('このトークンを削除しますか？')) {
      return;
    }
    post(`/admin/api-tokens/${tokenId}/destroy`);
  };

  return (
    <>
      <Head title="シフト API トークン管理" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          シフト API トークン管理
        </Typography>

        {/* API 仕様リンク */}
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          API 仕様:{' '}
          <Link
            href="/api-docs/shift-schedule.html"
            target="_blank"
            rel="noopener"
          >
            ReDoc（インタラクティブドキュメント）
          </Link>
        </Typography>

        {/* ユーザー情報 */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            トークン発行先
          </Typography>
          <Typography variant="body2">
            <strong>名前:</strong> {user.name}
          </Typography>
          <Typography variant="body2">
            <strong>メール:</strong> {user.email}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            あなたのアカウントに GAS 連携用トークン（
            <strong>shift_schedule:read</strong>
            ）を発行します。
          </Typography>
        </Alert>

        {/* トークン一覧 */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            発行済みトークン
          </Typography>

          {tokens.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontStyle: 'italic' }}
            >
              トークンが見つかりません。
            </Typography>
          ) : (
            <Paper sx={{ overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>名前</TableCell>
                    <TableCell>作成日時</TableCell>
                    <TableCell>最終使用日時</TableCell>
                    <TableCell>有効期限</TableCell>
                    <TableCell>状態</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens.map(token => (
                    <TableRow key={token.id}>
                      <TableCell>{token.name}</TableCell>
                      <TableCell>{token.created_at}</TableCell>
                      <TableCell>{token.last_used_at}</TableCell>
                      <TableCell>{token.expires_at}</TableCell>
                      <TableCell>
                        {token.is_expired ? (
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#d32f2f',
                              fontWeight: 'bold',
                            }}
                          >
                            期限切れ
                          </Typography>
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#388e3c',
                              fontWeight: 'bold',
                            }}
                          >
                            有効
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteToken(token.id)}
                          disabled={processing}
                        >
                          削除
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        {/* アクション */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleIssueToken}
            disabled={processing || tokens.length > 0}
            title={
              tokens.length > 0
                ? '既存トークンを削除するか、ローテーションを使用してください'
                : undefined
            }
          >
            新規トークンを発行
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#fb8c00' },
            }}
            onClick={handleRotateToken}
            disabled={processing}
          >
            トークンをローテーション
          </Button>
        </Stack>

        {/* 注意事項 */}
        <Alert severity="warning">
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            ℹ️ 注意事項
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>この画面はシフト取得 API の GAS 連携専用です。</li>
            <li>
              トークンを発行すると、初回のみプレーンテキストが表示されます。
            </li>
            <li>
              トークンは二度と表示されないため、安全な場所に保管してください。
            </li>
            <li>
              ローテーション実行時は、既存のトークンがすべて削除されます。
            </li>
            <li>
              定期的（目安: 年1回以上）にトークンをローテーションしてください。
            </li>
          </ul>
        </Alert>
      </Container>
    </>
  );
};
