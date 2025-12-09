// File: components/utils/adminDashboardHandlers.ts
export const createAdminDashboardHandlers = (setState) => {
  const {
    setEditingUser,
    setIsUserDialogOpen,
    setSendUserOnboardingEmail,
    setSelectedLead,
    setIsLeadDialogOpen,
    setPlayingMemo,
    setExpandedMemos,
    setViewerImages,
    setViewerInitialIndex,
    setIsImageViewerOpen,
    setActiveTab,
    setLeadFilters,
    setProducts,
    setNewProductName,
    setProductToDelete,
    setIsDeleteConfirmOpen,
    setTeamSortBy,
    setTeamSortOrder,
    setLeadsSortBy,
    setLeadsSortOrder
  } = setState;

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
    setSendUserOnboardingEmail(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserDialogOpen(true);
    setSendUserOnboardingEmail(true);
  };

  const openLeadDialog = (lead) => {
    setSelectedLead(lead);
    setIsLeadDialogOpen(true);
    setPlayingMemo(null);
  };

  const toggleMemoPlayback = (memoId) => {
    setPlayingMemo(prevPlayingMemo => prevPlayingMemo === memoId ? null : memoId);
  };

  const toggleMemoExpansion = (memoId) => {
    setExpandedMemos(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(memoId)) {
        newExpanded.delete(memoId);
      } else {
        newExpanded.add(memoId);
      }
      return newExpanded;
    });
  };

  const openImageViewer = (images, initialIndex = 0) => {
    setViewerImages(images);
    setViewerInitialIndex(initialIndex);
    setIsImageViewerOpen(true);
  };

  const handleLicenseBoxClick = () => {
    setActiveTab("team");
  };

  const addProduct = (newProductName) => {
    if (newProductName.trim()) {
      const newProduct = {
        id: Date.now(),
        name: newProductName.trim()
      };
      setProducts(prevProducts => [...prevProducts, newProduct]);
      setNewProductName("");
    }
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteProduct = (productToDelete) => {
    if (productToDelete) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const filterLeadsByHour = (hour) => {
    setLeadFilters(prev => ({ ...prev, hour: hour }));
    setActiveTab("leads");
  };

  const filterLeadsByWarmth = (warmth) => {
    setLeadFilters(prev => ({ ...prev, leadType: warmth }));
    setActiveTab("leads");
  };

  const filterLeadsByUser = (userId) => {
    setLeadFilters(prev => ({ ...prev, capturedById: userId }));
    setActiveTab("leads");
  };

  const filterLeadsByProduct = (productName) => {
    setLeadFilters(prev => ({ ...prev, product: productName }));
    setActiveTab("leads");
  };

  const clearFilters = () => {
    setLeadFilters({});
  };

  const removeFilter = (filterKey) => {
    setLeadFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const handleTeamSort = (column, teamSortBy, teamSortOrder) => {
    if (teamSortBy === column) {
      setTeamSortOrder(teamSortOrder === "desc" ? "asc" : "desc");
    } else {
      setTeamSortBy(column);
      setTeamSortOrder("desc");
    }
  };

  const handleLeadsSort = (column, leadsSortBy, leadsSortOrder) => {
    if (leadsSortBy === column) {
      setLeadsSortOrder(leadsSortOrder === "desc" ? "asc" : "desc");
    } else {
      setLeadsSortBy(column);
      setLeadsSortOrder("desc");
    }
  };

  const handleExportToExcel = () => {
    console.log("Exporting team leads to Excel...");
  };

  const getUserSubmitButtonText = (editingUser, sendUserOnboardingEmail) => {
    const baseText = editingUser ? "Update User" : "Add User";
    return sendUserOnboardingEmail ? `${baseText} & Send Email` : baseText;
  };

  return {
    handleEditUser,
    handleAddUser,
    openLeadDialog,
    toggleMemoPlayback,
    toggleMemoExpansion,
    openImageViewer,
    handleLicenseBoxClick,
    addProduct,
    handleDeleteProduct,
    confirmDeleteProduct,
    filterLeadsByHour,
    filterLeadsByWarmth,
    filterLeadsByUser,
    filterLeadsByProduct,
    clearFilters,
    removeFilter,
    handleTeamSort,
    handleLeadsSort,
    handleExportToExcel,
    getUserSubmitButtonText
  };
};
