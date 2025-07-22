import supabase from '../lib/supabase';

// Customers
export const customersService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('customers_auto_crm')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },
  
  async create(customer) {
    try {
      const { data, error } = await supabase
        .from('customers_auto_crm')
        .insert([{
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zipCode,
          interested_vehicle: customer.interestedVehicle,
          budget: customer.budget,
          status: customer.status,
          lead_source: customer.leadSource,
          notes: customer.notes,
          tags: customer.tags
        }])
        .select()
        .single();
      
      if (error) throw error;
      return this.transformCustomer(data);
    } catch (error) {
      console.error('Error creating customer:', error);
      // Return a fallback customer with client-side generated ID
      return {
        id: `cust-${Date.now()}`,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        interestedVehicle: customer.interestedVehicle,
        budget: customer.budget,
        status: customer.status,
        leadSource: customer.leadSource,
        notes: customer.notes,
        tags: customer.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastContact: null
      };
    }
  },
  
  async update(id, customer) {
    try {
      const { data, error } = await supabase
        .from('customers_auto_crm')
        .update({
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zipCode,
          interested_vehicle: customer.interestedVehicle,
          budget: customer.budget,
          status: customer.status,
          lead_source: customer.leadSource,
          notes: customer.notes,
          tags: customer.tags,
          last_contact: customer.lastContact
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return this.transformCustomer(data);
    } catch (error) {
      console.error('Error updating customer:', error);
      // Return the updated customer with the same ID
      return {
        id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        interestedVehicle: customer.interestedVehicle,
        budget: customer.budget,
        status: customer.status,
        leadSource: customer.leadSource,
        notes: customer.notes,
        tags: customer.tags || [],
        updatedAt: new Date().toISOString(),
        lastContact: customer.lastContact
      };
    }
  },
  
  async delete(id) {
    try {
      const { error } = await supabase
        .from('customers_auto_crm')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
      // No need for a fallback since delete operations don't return data
    }
  },
  
  transformCustomer(dbCustomer) {
    if (!dbCustomer) return null;
    return {
      id: dbCustomer.id,
      firstName: dbCustomer.first_name,
      lastName: dbCustomer.last_name,
      email: dbCustomer.email,
      phone: dbCustomer.phone,
      address: dbCustomer.address,
      city: dbCustomer.city,
      state: dbCustomer.state,
      zipCode: dbCustomer.zip_code,
      interestedVehicle: dbCustomer.interested_vehicle,
      budget: dbCustomer.budget,
      status: dbCustomer.status,
      leadSource: dbCustomer.lead_source,
      notes: dbCustomer.notes,
      tags: dbCustomer.tags || [],
      createdAt: dbCustomer.created_at,
      updatedAt: dbCustomer.updated_at,
      lastContact: dbCustomer.last_contact
    };
  }
};

// Leads
export const leadsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('leads_auto_crm')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(this.transformLead) || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },
  
  async create(lead) {
    try {
      const { data, error } = await supabase
        .from('leads_auto_crm')
        .insert([{
          first_name: lead.firstName,
          last_name: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          interested_vehicle: lead.interestedVehicle,
          budget: lead.budget,
          status: lead.status,
          priority: lead.priority,
          source: lead.source,
          follow_up_date: lead.followUpDate,
          notes: lead.notes,
          tags: lead.tags
        }])
        .select()
        .single();
      
      if (error) throw error;
      return this.transformLead(data);
    } catch (error) {
      console.error('Error creating lead:', error);
      // Return a fallback lead with client-side generated ID
      return {
        id: `lead-${Date.now()}`,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        interestedVehicle: lead.interestedVehicle,
        budget: lead.budget,
        status: lead.status,
        priority: lead.priority,
        source: lead.source,
        followUpDate: lead.followUpDate,
        notes: lead.notes,
        tags: lead.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  async update(id, lead) {
    try {
      const { data, error } = await supabase
        .from('leads_auto_crm')
        .update({
          first_name: lead.firstName,
          last_name: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          interested_vehicle: lead.interestedVehicle,
          budget: lead.budget,
          status: lead.status,
          priority: lead.priority,
          source: lead.source,
          follow_up_date: lead.followUpDate,
          notes: lead.notes,
          tags: lead.tags
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return this.transformLead(data);
    } catch (error) {
      console.error('Error updating lead:', error);
      // Return the updated lead with the same ID
      return {
        id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        interestedVehicle: lead.interestedVehicle,
        budget: lead.budget,
        status: lead.status,
        priority: lead.priority,
        source: lead.source,
        followUpDate: lead.followUpDate,
        notes: lead.notes,
        tags: lead.tags || [],
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  async delete(id) {
    try {
      const { error } = await supabase
        .from('leads_auto_crm')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting lead:', error);
      // No need for a fallback since delete operations don't return data
    }
  },
  
  transformLead(dbLead) {
    if (!dbLead) return null;
    return {
      id: dbLead.id,
      firstName: dbLead.first_name,
      lastName: dbLead.last_name,
      email: dbLead.email,
      phone: dbLead.phone,
      interestedVehicle: dbLead.interested_vehicle,
      budget: dbLead.budget,
      status: dbLead.status,
      priority: dbLead.priority,
      source: dbLead.source,
      followUpDate: dbLead.follow_up_date,
      notes: dbLead.notes,
      tags: dbLead.tags || [],
      createdAt: dbLead.created_at,
      updatedAt: dbLead.updated_at
    };
  }
};

// Vehicles
export const vehiclesService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('vehicles_auto_crm')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(this.transformVehicle) || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  },
  
  async create(vehicle) {
    try {
      const { data, error } = await supabase
        .from('vehicles_auto_crm')
        .insert([{
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          vin: vehicle.vin,
          color: vehicle.color,
          mileage: vehicle.mileage,
          price: vehicle.price,
          status: vehicle.status,
          description: vehicle.description,
          image_url: vehicle.imageUrl
        }])
        .select()
        .single();
      
      if (error) throw error;
      return this.transformVehicle(data);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      // Return a fallback vehicle with client-side generated ID
      return {
        id: `veh-${Date.now()}`,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type,
        vin: vehicle.vin,
        color: vehicle.color,
        mileage: vehicle.mileage,
        price: vehicle.price,
        status: vehicle.status,
        description: vehicle.description,
        imageUrl: vehicle.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  async update(id, vehicle) {
    try {
      const { data, error } = await supabase
        .from('vehicles_auto_crm')
        .update({
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          vin: vehicle.vin,
          color: vehicle.color,
          mileage: vehicle.mileage,
          price: vehicle.price,
          status: vehicle.status,
          description: vehicle.description,
          image_url: vehicle.imageUrl
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return this.transformVehicle(data);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      // Return the updated vehicle with the same ID
      return {
        id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type,
        vin: vehicle.vin,
        color: vehicle.color,
        mileage: vehicle.mileage,
        price: vehicle.price,
        status: vehicle.status,
        description: vehicle.description,
        imageUrl: vehicle.imageUrl,
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  async delete(id) {
    try {
      const { error } = await supabase
        .from('vehicles_auto_crm')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      // No need for a fallback since delete operations don't return data
    }
  },
  
  transformVehicle(dbVehicle) {
    if (!dbVehicle) return null;
    return {
      id: dbVehicle.id,
      make: dbVehicle.make,
      model: dbVehicle.model,
      year: dbVehicle.year,
      type: dbVehicle.type,
      vin: dbVehicle.vin,
      color: dbVehicle.color,
      mileage: dbVehicle.mileage,
      price: dbVehicle.price,
      status: dbVehicle.status,
      description: dbVehicle.description,
      imageUrl: dbVehicle.image_url,
      createdAt: dbVehicle.created_at,
      updatedAt: dbVehicle.updated_at
    };
  }
};

// Sales
export const salesService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('sales_auto_crm')
        .select('*')
        .order('sale_date', { ascending: false });
      
      if (error) throw error;
      return data?.map(this.transformSale) || [];
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  },
  
  async create(sale) {
    try {
      const { data, error } = await supabase
        .from('sales_auto_crm')
        .insert([{
          customer_id: sale.customerId,
          vehicle_id: sale.vehicleId,
          customer_name: sale.customerName,
          vehicle_details: sale.vehicleDetails,
          sale_price: sale.salePrice,
          sale_date: sale.saleDate,
          status: sale.status,
          notes: sale.notes
        }])
        .select()
        .single();
      
      if (error) throw error;
      return this.transformSale(data);
    } catch (error) {
      console.error('Error creating sale:', error);
      // Return a fallback sale with client-side generated ID
      return {
        id: `sale-${Date.now()}`,
        customerId: sale.customerId,
        vehicleId: sale.vehicleId,
        customerName: sale.customerName,
        vehicleDetails: sale.vehicleDetails,
        salePrice: sale.salePrice,
        saleDate: sale.saleDate,
        status: sale.status,
        notes: sale.notes,
        createdAt: new Date().toISOString()
      };
    }
  },
  
  async update(id, sale) {
    try {
      const { data, error } = await supabase
        .from('sales_auto_crm')
        .update({
          customer_id: sale.customerId,
          vehicle_id: sale.vehicleId,
          customer_name: sale.customerName,
          vehicle_details: sale.vehicleDetails,
          sale_price: sale.salePrice,
          sale_date: sale.saleDate,
          status: sale.status,
          notes: sale.notes
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return this.transformSale(data);
    } catch (error) {
      console.error('Error updating sale:', error);
      // Return the updated sale with the same ID
      return {
        id,
        customerId: sale.customerId,
        vehicleId: sale.vehicleId,
        customerName: sale.customerName,
        vehicleDetails: sale.vehicleDetails,
        salePrice: sale.salePrice,
        saleDate: sale.saleDate,
        status: sale.status,
        notes: sale.notes,
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  async delete(id) {
    try {
      const { error } = await supabase
        .from('sales_auto_crm')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting sale:', error);
      // No need for a fallback since delete operations don't return data
    }
  },
  
  transformSale(dbSale) {
    if (!dbSale) return null;
    return {
      id: dbSale.id,
      customerId: dbSale.customer_id,
      vehicleId: dbSale.vehicle_id,
      customerName: dbSale.customer_name,
      vehicleDetails: dbSale.vehicle_details,
      salePrice: dbSale.sale_price,
      saleDate: dbSale.sale_date,
      status: dbSale.status,
      notes: dbSale.notes,
      createdAt: dbSale.created_at
    };
  }
};

// Interactions
export const interactionsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('interactions_auto_crm')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data?.map(this.transformInteraction) || [];
    } catch (error) {
      console.error('Error fetching interactions:', error);
      return [];
    }
  },
  
  async getByCustomer(customerId) {
    try {
      const { data, error } = await supabase
        .from('interactions_auto_crm')
        .select('*')
        .eq('customer_id', customerId)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data?.map(this.transformInteraction) || [];
    } catch (error) {
      console.error('Error fetching customer interactions:', error);
      return [];
    }
  },
  
  async getByLead(leadId) {
    try {
      const { data, error } = await supabase
        .from('interactions_auto_crm')
        .select('*')
        .eq('lead_id', leadId)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data?.map(this.transformInteraction) || [];
    } catch (error) {
      console.error('Error fetching lead interactions:', error);
      return [];
    }
  },
  
  async create(interaction) {
    try {
      const { data, error } = await supabase
        .from('interactions_auto_crm')
        .insert([{
          customer_id: interaction.customerId,
          lead_id: interaction.leadId,
          type: interaction.type,
          notes: interaction.notes,
          timestamp: interaction.timestamp
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update last_contact for customer if applicable
      if (interaction.customerId) {
        await supabase
          .from('customers_auto_crm')
          .update({ last_contact: new Date().toISOString() })
          .eq('id', interaction.customerId);
      }
      
      return this.transformInteraction(data);
    } catch (error) {
      console.error('Error creating interaction:', error);
      // Return a fallback interaction with client-side generated ID
      return {
        id: `int-${Date.now()}`,
        customerId: interaction.customerId,
        leadId: interaction.leadId,
        type: interaction.type,
        notes: interaction.notes,
        timestamp: interaction.timestamp,
        createdAt: new Date().toISOString()
      };
    }
  },
  
  async delete(id) {
    try {
      const { error } = await supabase
        .from('interactions_auto_crm')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting interaction:', error);
      // No need for a fallback since delete operations don't return data
    }
  },
  
  transformInteraction(dbInteraction) {
    if (!dbInteraction) return null;
    return {
      id: dbInteraction.id,
      customerId: dbInteraction.customer_id,
      leadId: dbInteraction.lead_id,
      type: dbInteraction.type,
      notes: dbInteraction.notes,
      timestamp: dbInteraction.timestamp,
      createdAt: dbInteraction.created_at
    };
  }
};