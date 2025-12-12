import * as Contacts from 'expo-contacts';

export type PhoneContact = {
  id: string;
  name: string;
  phone?: string;
};

export async function requestContactsPermission(): Promise<'granted' | 'denied'> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === 'granted' ? 'granted' : 'denied';
}

export async function loadPhoneContacts(): Promise<PhoneContact[]> {
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.FirstName, Contacts.Fields.LastName, Contacts.Fields.PhoneNumbers],
    pageSize: 2000,
  });

  return data.map((c) => {
    const first = c.firstName ?? '';
    const last = c.lastName ?? '';
    const name = `${first} ${last}`.trim() || c.name || 'Unknown';
    const phone = c.phoneNumbers?.[0]?.number;
    return { id: c.id, name, phone };
  });
}
