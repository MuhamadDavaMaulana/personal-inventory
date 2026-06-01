<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Loan;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $loans = Loan::whereHas('item', function ($q) use ($request) {
                        $q->where('user_id', $request->user()->user_id);
                     })->with('item')->get();

        return response()->json($loans);
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id'       => 'required|exists:items,item_id',
            'borrower_name' => 'required|string|max:100',
            'borrowed_at'   => 'required|date',
            'due_date'      => 'nullable|date|after_or_equal:borrowed_at',
            'note'          => 'nullable|string',
        ]);

        // Pastikan barang milik user yang login
        $item = Item::where('item_id', $request->item_id)
                    ->where('user_id', $request->user()->user_id)
                    ->firstOrFail();

        $loan = Loan::create($request->only([
            'item_id', 'borrower_name', 'borrowed_at', 'due_date', 'note'
        ]));

        // Hitung jumlah pinjaman aktif (belum dikembalikan)
        $activeLoanCount = Loan::where('item_id', $item->item_id)
                               ->whereNull('returned_at')
                               ->count();

        // Status jadi borrowed hanya jika semua qty sudah dipinjam
        if ($activeLoanCount >= $item->quantity) {
            $item->update(['status' => 'borrowed']);
        }

        return response()->json($loan->load('item'), 201);
    }

    public function show(Request $request, $id)
    {
        $loan = Loan::whereHas('item', function ($q) use ($request) {
                        $q->where('user_id', $request->user()->user_id);
                     })->with('item')->findOrFail($id);

        return response()->json($loan);
    }

    public function update(Request $request, $id)
    {
        $loan = Loan::whereHas('item', function ($q) use ($request) {
                        $q->where('user_id', $request->user()->user_id);
                     })->findOrFail($id);

        $request->validate([
            'returned_at' => 'required|date',
        ]);

        $loan->update(['returned_at' => $request->returned_at]);

        // Hitung sisa pinjaman aktif setelah dikembalikan
        $activeLoanCount = Loan::where('item_id', $loan->item_id)
                               ->whereNull('returned_at')
                               ->count();

        // Status kembali available jika tidak ada pinjaman aktif
        if ($activeLoanCount === 0) {
            $loan->item->update(['status' => 'available']);
        }

        return response()->json(['message' => 'Barang berhasil dikembalikan', 'loan' => $loan]);
    }

    public function destroy(Request $request, $id)
    {
        $loan = Loan::whereHas('item', function ($q) use ($request) {
                        $q->where('user_id', $request->user()->user_id);
                     })->with('item')->findOrFail($id);

        $itemId = $loan->item_id;
        $loan->delete();

        // Hitung sisa pinjaman aktif setelah dihapus
        $activeLoanCount = Loan::where('item_id', $itemId)
                               ->whereNull('returned_at')
                               ->count();

        // Reset status ke available jika tidak ada pinjaman aktif
        if ($activeLoanCount === 0) {
            Item::where('item_id', $itemId)->update(['status' => 'available']);
        }

        return response()->json(['message' => 'Data peminjaman dihapus']);
    }
}