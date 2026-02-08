'use client'

import {Area} from '@prisma/client'
import {Pencil, Plus, Trash2} from 'lucide-react'
import {useState} from 'react'

import {createAreaAction, deleteAreaAction, updateAreaAction} from '@/app/actions'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@/components/ui'

interface AreaManagementProps {
  areas: Area[]
}

export function AreaManagement({areas}: AreaManagementProps) {
  const [open, setOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
  })

  const handleOpenDialog = (area?: Area) => {
    if (area) {
      setEditingArea(area)
      setFormData({
        name: area.name,
        code: area.code,
        address: area.address,
      })
    } else {
      setEditingArea(null)
      setFormData({
        name: '',
        code: '',
        address: '',
      })
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = editingArea
      ? await updateAreaAction({id: editingArea.id, ...formData})
      : await createAreaAction(formData)

    setIsLoading(false)

    if (result.success) {
      setOpen(false)
      setFormData({name: '', code: '', address: ''})
    } else {
      alert(result.error || 'Có lỗi xảy ra')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khu vực này?')) return

    const result = await deleteAreaAction(id)
    if (!result.success) {
      alert(result.error || 'Có lỗi xảy ra')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý Khu vực</CardTitle>
            <CardDescription>Quản lý các khu vực / chùa trong hệ thống</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm khu vực
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.map((area) => (
              <TableRow key={area.id}>
                <TableCell className="font-medium">{area.name}</TableCell>
                <TableCell className="max-w-md truncate">{area.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(area)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(area.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingArea ? 'Sửa khu vực' : 'Thêm khu vực mới'}</DialogTitle>
                <DialogDescription>
                  {editingArea ? 'Cập nhật thông tin khu vực' : 'Nhập thông tin khu vực mới'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên khu vực / Chùa</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      const updates = {...formData, name}

                      if (!editingArea) {
                        const code = name
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .toLowerCase()
                          .replace(/\s+/g, '_')
                          .replace(/[^a-z0-9_]/g, '')
                        updates.code = code
                      }

                      setFormData(updates)
                    }}
                    placeholder="Bửu Hưng Tự"
                    required
                  />
                </div>

                {!editingArea && (
                  <div className="grid gap-2">
                    <Label htmlFor="code">Mã (Tự động tạo)</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="buu_hung_tu"
                      required
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Việt Nam quốc, Tiền Giang tỉnh, Gò Công thị xã, Bình Xuân xã"
                    required
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang lưu...' : editingArea ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
